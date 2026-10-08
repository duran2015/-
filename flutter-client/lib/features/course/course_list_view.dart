import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/router/route_paths.dart';
import '../../core/theme/app_colors.dart';
import 'course_models.dart';
import 'course_view_model.dart';

/// 「课程练习」Tab 的视频课程列表：
/// 顶部分类筛选 + 课程卡片流（免费/付费/已购标签）。
/// 数据来自 CourseApi（mock 或真实后台），不再硬编码。
class CourseListView extends ConsumerStatefulWidget {
  const CourseListView({super.key});

  @override
  ConsumerState<CourseListView> createState() => _CourseListViewState();
}

class _CourseListViewState extends ConsumerState<CourseListView> {
  static const _categories = ['全部', '家庭教育', '亲密关系', '情绪管理', '自我成长'];

  String _category = '全部';

  @override
  Widget build(BuildContext context) {
    final listAsync = ref.watch(courseListProvider(_category));
    return ListView(
      key: const ValueKey('courses'),
      padding: const EdgeInsets.fromLTRB(20, 4, 20, 120),
      children: [
        const Text('后台上传的音视频课程，免费课直接看，付费课可试看后再决定。',
            style: TextStyle(height: 1.5, color: AppColors.textSecondary)),
        const SizedBox(height: 14),
        SizedBox(
          height: 38,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: _categories.length,
            separatorBuilder: (_, __) => const SizedBox(width: 8),
            itemBuilder: (context, i) {
              final c = _categories[i];
              final selected = c == _category;
              return ChoiceChip(
                label: Text(c),
                selected: selected,
                onSelected: (_) => setState(() => _category = c),
                selectedColor: const Color(0xFF245F58),
                backgroundColor: Colors.white,
                side: BorderSide(
                    color: selected
                        ? const Color(0xFF245F58)
                        : const Color(0xFFDDE7E3)),
                labelStyle: TextStyle(
                  fontSize: 13,
                  fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
                  color: selected ? Colors.white : AppColors.textSecondary,
                ),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(99)),
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                showCheckmark: false,
              );
            },
          ),
        ),
        const SizedBox(height: 16),
        listAsync.when(
          loading: () => const Padding(
            padding: EdgeInsets.only(top: 60),
            child: Center(child: CircularProgressIndicator()),
          ),
          error: (e, _) => Padding(
            padding: const EdgeInsets.only(top: 60),
            child: Center(child: Text('课程加载失败：$e')),
          ),
          data: (courses) => courses.isEmpty
              ? const Padding(
                  padding: EdgeInsets.only(top: 60),
                  child: Center(child: Text('该分类下暂无课程')),
                )
              : Column(
                  children: [
                    for (final course in courses) _CourseCard(course: course),
                  ],
                ),
        ),
      ],
    );
  }
}

class _CourseCard extends StatelessWidget {
  const _CourseCard({required this.course});

  final Course course;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: Material(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: () =>
              context.push('${RoutePaths.courseDetail}?id=${course.id}'),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(children: [
              _CoverBadge(course: course),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(children: [
                        _PriceTag(course: course),
                        const Spacer(),
                        Text('${course.learnedCount} 人学过',
                            style: const TextStyle(
                                fontSize: 10,
                                color: AppColors.textTertiary)),
                      ]),
                      const SizedBox(height: 6),
                      Text(course.title,
                          style: const TextStyle(
                              fontSize: 16, fontWeight: FontWeight.w700)),
                      const SizedBox(height: 4),
                      Text(course.subtitle,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                              fontSize: 12,
                              height: 1.4,
                              color: AppColors.textSecondary)),
                      const SizedBox(height: 8),
                      Text(
                        '${course.category} · ${course.lessonCount} 讲 · 约 ${course.totalMinutes} 分钟',
                        style: const TextStyle(
                            fontSize: 11, color: AppColors.textTertiary),
                      ),
                    ]),
              ),
            ]),
          ),
        ),
      ),
    );
  }
}

class _CoverBadge extends StatelessWidget {
  const _CoverBadge({required this.course});
  final Course course;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 86,
      height: 108,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF245F58), Color(0xFF3C8177)],
        ),
        borderRadius: BorderRadius.circular(18),
      ),
      child: Stack(children: [
        Center(
          child: Text(course.coverEmoji ?? '🎧',
              style: const TextStyle(fontSize: 36)),
        ),
        Positioned(
          right: 8,
          bottom: 8,
          child: Container(
            padding: const EdgeInsets.all(4),
            decoration: const BoxDecoration(
                color: Color(0x59FFFFFF), shape: BoxShape.circle),
            child: const Icon(Icons.play_arrow_rounded,
                size: 14, color: Colors.white),
          ),
        ),
      ]),
    );
  }
}

class _PriceTag extends StatelessWidget {
  const _PriceTag({required this.course});
  final Course course;

  @override
  Widget build(BuildContext context) {
    final (label, bg, fg) = course.isFree
        ? ('免费', const Color(0xFFDCEDE7), const Color(0xFF286D64))
        : course.purchased
            ? ('已购', const Color(0xFFDCEDE7), const Color(0xFF286D64))
            : (course.priceLabel, const Color(0xFFFFF3EA),
                const Color(0xFFB2744E));
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration:
          BoxDecoration(color: bg, borderRadius: BorderRadius.circular(99)),
      child: Text(label,
          style:
              TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: fg)),
    );
  }
}
