import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/network/api_client.dart';
import 'course_api.dart';
import 'course_models.dart';

final courseApiProvider =
    Provider<CourseApi>((ref) => CourseApi(ref.read(apiClientProvider)));

/// 课程列表（按分类过滤，null/「全部」为全量）。
final courseListProvider =
    FutureProvider.family<List<Course>, String?>((ref, category) {
  return ref.read(courseApiProvider).fetchList(category: category);
});

/// 课程详情（含课时与购买状态）。
final courseDetailProvider =
    FutureProvider.family<Course?, int>((ref, courseId) {
  return ref.read(courseApiProvider).fetchDetail(courseId);
});

/// 购买课程：成功后刷新详情与列表的购买状态。
final courseBuyControllerProvider =
    NotifierProvider<CourseBuyController, bool>(CourseBuyController.new);

/// 购买进行中的 loading 状态（true = 正在下单）。
class CourseBuyController extends Notifier<bool> {
  @override
  bool build() => false;

  Future<bool> buy(int courseId) async {
    if (state) return false;
    state = true;
    try {
      final ok = await ref.read(courseApiProvider).buy(courseId);
      if (ok) {
        ref.invalidate(courseDetailProvider(courseId));
        ref.invalidate(courseListProvider);
      }
      return ok;
    } finally {
      state = false;
    }
  }
}
