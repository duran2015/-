import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/router/route_paths.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../order/content_order_api.dart';
import '../order/content_order_models.dart';
import '../payment/payment_view_model.dart';
import 'course_models.dart';
import 'course_view_model.dart';

/// 课程详情页：封面信息 + 讲师 + 简介 + 课时列表 + 底部购买栏。
///
/// 免费课程全部课时可播；付费课程未购买仅 freePreview 课时可播（试看），
/// 购买走内容订单链路：/app/content-order/create → 统一支付确认页 /payment。
class CourseDetailPage extends ConsumerWidget {
  const CourseDetailPage({super.key, required this.courseId});

  final int courseId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final detailAsync = ref.watch(courseDetailProvider(courseId));
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F3),
      appBar: AppBar(
        title: const Text('课程详情'),
        backgroundColor: const Color(0xFFF1F5F3),
      ),
      body: detailAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('课程加载失败：$e')),
        data: (course) => course == null
            ? const Center(child: Text('课程不存在或已下架'))
            : _CourseDetailBody(course: course),
      ),
    );
  }
}

class _CourseDetailBody extends ConsumerWidget {
  const _CourseDetailBody({required this.course});

  final Course course;

  void _playLesson(BuildContext context, CourseLesson lesson) {
    if (!course.canPlay(lesson)) return;
    context.push(
      '${RoutePaths.coursePlayer}?courseId=${course.id}&lessonId=${lesson.id}',
    );
  }

  /// 立即购买：创建内容订单 → 跳统一支付确认页（/payment）。
  /// 支付成功后由支付成功页跳回本详情（purchased 已解锁）。
  Future<void> _buy(BuildContext context, WidgetRef ref) async {
    final order = await ref.read(contentOrderApiProvider).create(
          bizType: ContentOrderBiz.course,
          refId: course.id,
        );
    if (!context.mounted) return;
    if (order == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('下单失败，请稍后重试')),
      );
      return;
    }
    final args = PaymentPageArgs.fromContentOrder(
      orderId: order.orderId,
      bizType: order.bizType.value,
      refId: order.refId,
      title: order.title,
      subtitle: order.subtitle,
      priceFen: order.priceFen,
      payDeadline: order.payDeadline,
    );
    await context.push(
      Uri(path: RoutePaths.payment, queryParameters: args.toQuery())
          .toString(),
    );
    // 从支付页返回（可能已支付成功）：刷新详情与列表的购买状态。
    // 注意：支付成功页用 go() 替换栈时本组件已卸载，此时 invalidate 会
    // 抛异常，故先判 mounted；成功路径的缓存失效由支付成功页负责。
    if (!context.mounted) return;
    ref.invalidate(courseDetailProvider(course.id));
    ref.invalidate(courseListProvider);
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Stack(
      children: [
        ListView(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 140),
          children: [
            _CourseHeader(course: course),
            const SizedBox(height: 20),
            if (course.teacherName != null) ...[
              _TeacherCard(course: course),
              const SizedBox(height: 20),
            ],
            if (course.description != null) ...[
              Text('课程介绍', style: AppTextStyles.title.copyWith(fontSize: 18)),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(course.description!,
                    style: const TextStyle(
                        fontSize: 14, height: 1.7, color: Color(0xFF3A4441))),
              ),
              const SizedBox(height: 20),
            ],
            Row(children: [
              Text('课时列表', style: AppTextStyles.title.copyWith(fontSize: 18)),
              const SizedBox(width: 8),
              Text('${course.lessons.length} 讲',
                  style: const TextStyle(
                      fontSize: 12, color: AppColors.textTertiary)),
            ]),
            const SizedBox(height: 10),
            for (var i = 0; i < course.lessons.length; i++)
              _LessonTile(
                course: course,
                lesson: course.lessons[i],
                onTap: () => _playLesson(context, course.lessons[i]),
              ),
          ],
        ),
        Positioned(
          left: 0,
          right: 0,
          bottom: 0,
          child: _BottomBar(course: course, onBuy: () => _buy(context, ref)),
        ),
      ],
    );
  }
}

class _CourseHeader extends StatelessWidget {
  const _CourseHeader({required this.course});
  final Course course;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF245F58), Color(0xFF3C8177)],
        ),
        borderRadius: BorderRadius.circular(24),
      ),
      padding: const EdgeInsets.all(20),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0x33FFFFFF),
              borderRadius: BorderRadius.circular(99),
            ),
            child: Text(course.category,
                style: const TextStyle(fontSize: 11, color: Colors.white)),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
            decoration: BoxDecoration(
              color: course.isFree
                  ? const Color(0xFFBDE6D9)
                  : const Color(0xFFFFE0B2),
              borderRadius: BorderRadius.circular(99),
            ),
            child: Text(
              course.isFree
                  ? '免费课程'
                  : (course.purchased ? '已购买' : '付费课程'),
              style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: course.isFree
                      ? const Color(0xFF245F58)
                      : const Color(0xFF8A5B3D)),
            ),
          ),
          const Spacer(),
          Text(course.coverEmoji ?? '🎧', style: const TextStyle(fontSize: 40)),
        ]),
        const SizedBox(height: 14),
        Text(course.title,
            style: const TextStyle(
                fontSize: 22,
                height: 1.3,
                fontWeight: FontWeight.w800,
                color: Colors.white)),
        const SizedBox(height: 6),
        Text(course.subtitle,
            style: const TextStyle(
                fontSize: 13, height: 1.5, color: Color(0xFFD9EFE8))),
        const SizedBox(height: 14),
        Text(
          '${course.lessonCount} 讲 · 约 ${course.totalMinutes} 分钟 · ${course.learnedCount} 人学过',
          style: const TextStyle(fontSize: 11, color: Color(0xB3FFFFFF)),
        ),
      ]),
    );
  }
}

class _TeacherCard extends StatelessWidget {
  const _TeacherCard({required this.course});
  final Course course;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(children: [
        Container(
          width: 46,
          height: 46,
          decoration: const BoxDecoration(
              color: Color(0xFFDCEDE7), shape: BoxShape.circle),
          child: const Icon(Icons.person_outline_rounded,
              color: Color(0xFF286D64)),
        ),
        const SizedBox(width: 12),
        Expanded(
          child:
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(course.teacherName!,
                style: const TextStyle(
                    fontSize: 15, fontWeight: FontWeight.w700)),
            if (course.teacherTitle != null) ...[
              const SizedBox(height: 3),
              Text(course.teacherTitle!,
                  style: const TextStyle(
                      fontSize: 12, color: AppColors.textSecondary)),
            ],
          ]),
        ),
      ]),
    );
  }
}

class _LessonTile extends StatelessWidget {
  const _LessonTile({
    required this.course,
    required this.lesson,
    required this.onTap,
  });

  final Course course;
  final CourseLesson lesson;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final playable = course.canPlay(lesson);
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Material(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        child: InkWell(
          onTap: playable ? onTap : null,
          borderRadius: BorderRadius.circular(18),
          child: Opacity(
            opacity: playable ? 1 : 0.62,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              child: Row(children: [
                Container(
                  width: 42,
                  height: 42,
                  decoration: BoxDecoration(
                    color: playable
                        ? const Color(0xFFE7F1ED)
                        : const Color(0xFFF1F1EF),
                    borderRadius: BorderRadius.circular(13),
                  ),
                  child: Icon(
                    playable
                        ? (lesson.mediaType == CourseMediaType.video
                            ? Icons.play_circle_outline_rounded
                            : Icons.headphones_rounded)
                        : Icons.lock_outline_rounded,
                    size: 21,
                    color: playable
                        ? const Color(0xFF286D64)
                        : AppColors.textTertiary,
                  ),
                ),
                const SizedBox(width: 13),
                Expanded(
                  child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(lesson.title,
                            style: const TextStyle(
                                fontSize: 14, fontWeight: FontWeight.w600)),
                        const SizedBox(height: 4),
                        Row(children: [
                          Text(
                            lesson.mediaType == CourseMediaType.video
                                ? '视频'
                                : '音频',
                            style: const TextStyle(
                                fontSize: 11,
                                color: AppColors.textTertiary),
                          ),
                          const Text(' · ',
                              style: TextStyle(
                                  fontSize: 11,
                                  color: AppColors.textTertiary)),
                          Text(lesson.durationLabel,
                              style: const TextStyle(
                                  fontSize: 11,
                                  color: AppColors.textTertiary)),
                        ]),
                      ]),
                ),
                if (!course.isUnlocked && lesson.freePreview)
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFFF3EA),
                      borderRadius: BorderRadius.circular(99),
                    ),
                    child: const Text('试看',
                        style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF8A5B3D))),
                  ),
                if (!playable)
                  const Text('付费',
                      style: TextStyle(
                          fontSize: 11, color: AppColors.textTertiary)),
              ]),
            ),
          ),
        ),
      ),
    );
  }
}

class _BottomBar extends StatelessWidget {
  const _BottomBar({
    required this.course,
    required this.onBuy,
  });

  final Course course;
  final VoidCallback onBuy;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.fromLTRB(
          20, 12, 20, 16 + MediaQuery.of(context).padding.bottom),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Color(0xFFE2EAE6))),
      ),
      child: course.isUnlocked
          ? SizedBox(
              width: double.infinity,
              child: FilledButton.icon(
                onPressed: course.lessons.isEmpty
                    ? null
                    : () => context.push(
                        '${RoutePaths.coursePlayer}?courseId=${course.id}'
                        '&lessonId=${course.lessons.first.id}'),
                icon: const Icon(Icons.play_arrow_rounded),
                label: Text(course.isFree ? '免费学习 · 开始第一课' : '已购买 · 继续学习'),
              ),
            )
          : Row(children: [
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(course.priceLabel,
                    style: const TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFFB2744E))),
                const Text('购买后永久可反复观看',
                    style: TextStyle(
                        fontSize: 10, color: AppColors.textTertiary)),
              ]),
              const SizedBox(width: 18),
              Expanded(
                child: FilledButton(
                  onPressed: onBuy,
                  child: const Text('立即购买'),
                ),
              ),
            ]),
    );
  }
}
