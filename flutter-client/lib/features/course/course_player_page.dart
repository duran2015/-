import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:video_player/video_player.dart';

import 'course_models.dart';
import 'course_view_model.dart';

/// 课程播放页：按课时媒体类型选择视频或音频播放器。
/// 未解锁课时不应能到达本页（详情页已拦截），这里兜底展示付费提示。
class CoursePlayerPage extends ConsumerWidget {
  const CoursePlayerPage({
    super.key,
    required this.courseId,
    required this.lessonId,
  });

  final int courseId;
  final int lessonId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final detailAsync = ref.watch(courseDetailProvider(courseId));
    return Scaffold(
      backgroundColor: const Color(0xFF101615),
      appBar: AppBar(
        backgroundColor: const Color(0xFF101615),
        foregroundColor: Colors.white,
        title: const Text('播放'),
      ),
      body: detailAsync.when(
        loading: () => const Center(
            child: CircularProgressIndicator(color: Color(0xFF4FB3A9))),
        error: (e, _) => _ErrorHint(message: '课程加载失败：$e'),
        data: (course) {
          if (course == null) return const _ErrorHint(message: '课程不存在');
          final lesson =
              course.lessons.where((l) => l.id == lessonId).firstOrNull;
          if (lesson == null) return const _ErrorHint(message: '课时不存在');
          if (!course.canPlay(lesson)) {
            return _LockedHint(course: course);
          }
          return SafeArea(
            top: false,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (lesson.mediaType == CourseMediaType.video)
                  _VideoPlayer(lesson: lesson)
                else
                  _AudioPlayer(lesson: lesson),
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 18, 20, 0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(lesson.title,
                          style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w700,
                              color: Colors.white)),
                      const SizedBox(height: 6),
                      Text(
                        '${course.title} · ${lesson.durationLabel}',
                        style: const TextStyle(
                            fontSize: 12, color: Color(0xFF9DB3AE)),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _ErrorHint extends StatelessWidget {
  const _ErrorHint({required this.message});
  final String message;
  @override
  Widget build(BuildContext context) => Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Text(message,
              textAlign: TextAlign.center,
              style: const TextStyle(color: Color(0xFF9DB3AE))),
        ),
      );
}

class _LockedHint extends StatelessWidget {
  const _LockedHint({required this.course});
  final Course course;
  @override
  Widget build(BuildContext context) => Center(
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          const Icon(Icons.lock_outline_rounded,
              size: 44, color: Color(0xFF9DB3AE)),
          const SizedBox(height: 14),
          const Text('本课时为付费内容', style: TextStyle(color: Colors.white)),
          const SizedBox(height: 18),
          FilledButton(
            onPressed: () => context.pop(),
            child: const Text('返回课程页购买'),
          ),
        ]),
      );
}

// ---------------- 视频播放器 ----------------

class _VideoPlayer extends StatefulWidget {
  const _VideoPlayer({required this.lesson});
  final CourseLesson lesson;

  @override
  State<_VideoPlayer> createState() => _VideoPlayerState();
}

class _VideoPlayerState extends State<_VideoPlayer> {
  late final VideoPlayerController _controller;
  bool _ready = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _controller = widget.lesson.isAsset
        ? VideoPlayerController.asset(widget.lesson.assetPath)
        : VideoPlayerController.networkUrl(Uri.parse(widget.lesson.mediaUrl));
    _controller.initialize().then((_) {
      if (!mounted) return;
      // 不自动播放：浏览器要求有声视频必须由用户手势触发，
      // 进页停在首帧 + 中央播放键，点击即播。
      setState(() => _ready = true);
    }).catchError((e) {
      if (mounted) setState(() => _error = '$e');
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  String _fmt(Duration d) {
    final m = d.inMinutes;
    final s = d.inSeconds % 60;
    return '${m.toString().padLeft(2, '0')}:${s.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    if (_error != null) return _ErrorHint(message: '视频加载失败：$_error');
    if (!_ready) {
      return const AspectRatio(
        aspectRatio: 16 / 9,
        child: ColoredBox(
          color: Colors.black,
          child: Center(
              child: CircularProgressIndicator(color: Color(0xFF4FB3A9))),
        ),
      );
    }
    return Column(
      children: [
        GestureDetector(
          onTap: () => setState(() => _controller.value.isPlaying
              ? _controller.pause()
              : _controller.play()),
          child: AspectRatio(
            aspectRatio: _controller.value.aspectRatio,
            child: Stack(
              alignment: Alignment.center,
              children: [
                VideoPlayer(_controller),
                if (!_controller.value.isPlaying)
                  const Icon(Icons.play_circle_fill_rounded,
                      size: 64, color: Color(0xCCFFFFFF)),
              ],
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8),
          child: ValueListenableBuilder(
            valueListenable: _controller,
            builder: (context, value, _) => Row(
              children: [
                Text(_fmt(value.position),
                    style: const TextStyle(
                        fontSize: 11, color: Color(0xFF9DB3AE))),
                Expanded(
                  child: Slider(
                    value: value.position.inMilliseconds
                        .clamp(0, value.duration.inMilliseconds)
                        .toDouble(),
                    max: value.duration.inMilliseconds.toDouble(),
                    activeColor: const Color(0xFF4FB3A9),
                    inactiveColor: const Color(0xFF33403D),
                    onChanged: (ms) => _controller
                        .seekTo(Duration(milliseconds: ms.round())),
                  ),
                ),
                Text(_fmt(value.duration),
                    style: const TextStyle(
                        fontSize: 11, color: Color(0xFF9DB3AE))),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

// ---------------- 音频播放器 ----------------
// 音频课时同样走 video_player（<video> 元素可播放 mp3/aac），
// 避开 audioplayers web 端在部分浏览器的 setSource 兼容问题；
// 仅借用其播放控制与进度流，渲染自绘的音频卡片 UI。

class _AudioPlayer extends StatefulWidget {
  const _AudioPlayer({required this.lesson});
  final CourseLesson lesson;

  @override
  State<_AudioPlayer> createState() => _AudioPlayerState();
}

class _AudioPlayerState extends State<_AudioPlayer> {
  late final VideoPlayerController _controller;
  bool _ready = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _controller = widget.lesson.isAsset
        ? VideoPlayerController.asset(widget.lesson.assetPath)
        : VideoPlayerController.networkUrl(Uri.parse(widget.lesson.mediaUrl));
    _controller.initialize().then((_) {
      if (!mounted) return;
      // 不自动播放：浏览器自动播放策略要求用户手势，进页停在暂停态，
      // 由用户点播放键触发（点击即合法手势）。
      setState(() => _ready = true);
    }).catchError((e) {
      if (mounted) setState(() => _error = '$e');
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  String _fmt(Duration d) {
    final m = d.inMinutes;
    final s = d.inSeconds % 60;
    return '${m.toString().padLeft(2, '0')}:${s.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    if (_error != null) return _ErrorHint(message: '音频加载失败：$_error');
    return Container(
      margin: const EdgeInsets.fromLTRB(20, 24, 20, 0),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF1E3632), Color(0xFF152421)],
        ),
        borderRadius: BorderRadius.circular(24),
      ),
      child: !_ready
          ? const Padding(
              padding: EdgeInsets.symmetric(vertical: 40),
              child: Center(
                  child: CircularProgressIndicator(color: Color(0xFF4FB3A9))),
            )
          : ValueListenableBuilder(
              valueListenable: _controller,
              builder: (context, value, _) {
                final playing = value.isPlaying;
                final maxMs = value.duration.inMilliseconds.toDouble();
                return Column(
                  children: [
                    const Icon(Icons.graphic_eq_rounded,
                        size: 56, color: Color(0xFF4FB3A9)),
                    const SizedBox(height: 8),
                    const Text('音频课',
                        style: TextStyle(
                            fontSize: 12, color: Color(0xFF9DB3AE))),
                    const SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        IconButton(
                          onPressed: () => _controller.seekTo(
                              value.position - const Duration(seconds: 15)),
                          icon: const Icon(Icons.replay_rounded,
                              color: Colors.white, size: 30),
                        ),
                        const SizedBox(width: 12),
                        InkWell(
                          onTap: () => playing
                              ? _controller.pause()
                              : _controller.play(),
                          customBorder: const CircleBorder(),
                          child: Container(
                            width: 68,
                            height: 68,
                            decoration: const BoxDecoration(
                                color: Color(0xFF4FB3A9),
                                shape: BoxShape.circle),
                            child: Icon(
                              playing
                                  ? Icons.pause_rounded
                                  : Icons.play_arrow_rounded,
                              size: 40,
                              color: const Color(0xFF0E1A18),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        IconButton(
                          onPressed: () => _controller.seekTo(
                              value.position + const Duration(seconds: 15)),
                          icon: const Icon(Icons.forward_rounded,
                              color: Colors.white, size: 30),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(children: [
                      Text(_fmt(value.position),
                          style: const TextStyle(
                              fontSize: 11, color: Color(0xFF9DB3AE))),
                      Expanded(
                        child: Slider(
                          value: value.position.inMilliseconds
                              .clamp(0, value.duration.inMilliseconds)
                              .toDouble(),
                          max: maxMs > 0 ? maxMs : 1,
                          activeColor: const Color(0xFF4FB3A9),
                          inactiveColor: const Color(0xFF33403D),
                          onChanged: maxMs > 0
                              ? (ms) => _controller
                                  .seekTo(Duration(milliseconds: ms.round()))
                              : null,
                        ),
                      ),
                      Text(_fmt(value.duration),
                          style: const TextStyle(
                              fontSize: 11, color: Color(0xFF9DB3AE))),
                    ]),
                  ],
                );
              },
            ),
    );
  }
}
