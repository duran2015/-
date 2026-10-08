import '../../core/network/api_client.dart';
import 'course_models.dart';

/// 音视频课程接口封装。
///
/// 课程内容由后台（管理端）上传维护，客户端只读 + 购买：
/// - [listPath] 课程列表（可按分类过滤）
/// - [detailPath] 课程详情（含课时列表与当前用户购买状态）
/// - [buyPath] 购买课程（mock 直接成功；接真实支付时由后台
///   对接 /app/pay/create 链路返回支付参数）
class CourseApi {
  CourseApi(this._client);

  final ApiClient _client;

  static const listPath = '/app/course/list';
  static const detailPath = '/app/course/detail';
  static const buyPath = '/app/course/buy';

  /// 课程列表。[category] 为 null 或「全部」时返回全量。
  Future<List<Course>> fetchList({String? category}) async {
    final data = await _client.postData<Map<String, dynamic>>(
      listPath,
      {if (category != null && category != '全部') 'category': category},
      decoder: (json) => Map<String, dynamic>.from(json as Map),
    );
    final list = (data?['list'] as List?) ?? const [];
    return [
      for (final item in list)
        Course.fromJson(Map<String, dynamic>.from(item as Map)),
    ];
  }

  /// 课程详情（含课时）。课程不存在时返回 null。
  Future<Course?> fetchDetail(int courseId) {
    return _client.postData<Course>(
      detailPath,
      {'courseId': courseId},
      decoder: (json) =>
          Course.fromJson(Map<String, dynamic>.from(json as Map)),
    );
  }

  /// 购买课程。成功返回 true。
  Future<bool> buy(int courseId) async {
    try {
      await _client.postMessage(buyPath, {'courseId': courseId});
      return true;
    } catch (_) {
      return false;
    }
  }
}
