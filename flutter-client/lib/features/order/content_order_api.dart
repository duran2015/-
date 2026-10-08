import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/network/api_client.dart';
import 'content_order_models.dart';

/// 内容订单接口（课程/测评报告购买）。
///
/// - [createPath] 下单（返回带支付截止时间的待支付订单）
/// - [listPath] 我的内容订单列表（按 bizType 过滤）
/// - [cancelPath] 用户主动取消待支付订单
class ContentOrderApi {
  ContentOrderApi(this._client);

  final ApiClient _client;

  static const createPath = '/app/content-order/create';
  static const listPath = '/app/content-order/list';
  static const cancelPath = '/app/content-order/cancel';

  /// 创建内容订单。已存在同一商品的待支付订单时后台应复用（幂等）。
  Future<ContentOrder?> create({
    required ContentOrderBiz bizType,
    required int refId,
  }) {
    return _client.postData<ContentOrder>(
      createPath,
      {'bizType': bizType.value, 'refId': refId},
      decoder: (json) =>
          ContentOrder.fromJson(Map<String, dynamic>.from(json as Map)),
    );
  }

  /// 我的内容订单列表；[bizType] 为 null 时返回全部。
  Future<List<ContentOrder>> fetchList({ContentOrderBiz? bizType}) async {
    final data = await _client.postData<Map<String, dynamic>>(
      listPath,
      {if (bizType != null) 'bizType': bizType.value},
      decoder: (json) => Map<String, dynamic>.from(json as Map),
    );
    final list = (data?['list'] as List?) ?? const [];
    return [
      for (final item in list)
        ContentOrder.fromJson(Map<String, dynamic>.from(item as Map)),
    ];
  }

  /// 取消待支付订单。成功返回 true。
  Future<bool> cancel(String orderId) async {
    try {
      await _client.postMessage(cancelPath, {'orderId': orderId});
      return true;
    } catch (_) {
      return false;
    }
  }
}

final contentOrderApiProvider =
    Provider<ContentOrderApi>((ref) => ContentOrderApi(ref.read(apiClientProvider)));

/// 我的内容订单列表（按业务类型过滤）。
final contentOrderListProvider =
    FutureProvider.family<List<ContentOrder>, ContentOrderBiz>((ref, bizType) {
  return ref.read(contentOrderApiProvider).fetchList(bizType: bizType);
});
