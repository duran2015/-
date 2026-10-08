/// 内容订单（课程 / 测评报告）数据模型与状态机。
///
/// 与预约订单（AppointmentOrderItem）并行存在：
/// 预约订单走 /app/consultant/order/* 链路；内容订单走 /app/content-order/*。
///
/// 状态机：
///   pendingPayment（待支付，带支付截止时间）
///     → paid（支付完成）
///     → cancelledUser（用户主动取消）
///     → cancelledTimeout（超时未支付自动取消）
library;

/// 内容订单业务类型。
enum ContentOrderBiz {
  course,
  assessment;

  static ContentOrderBiz parse(String? raw) =>
      raw == 'assessment' ? ContentOrderBiz.assessment : ContentOrderBiz.course;

  String get value => this == ContentOrderBiz.assessment ? 'assessment' : 'course';

  String get label => this == ContentOrderBiz.assessment ? '测评' : '课程';
}

/// 内容订单状态。
enum ContentOrderStatus {
  pendingPayment,
  paid,
  cancelledUser,
  cancelledTimeout;

  static ContentOrderStatus parse(String? raw) => switch (raw) {
        'paid' => ContentOrderStatus.paid,
        'cancelled_user' => ContentOrderStatus.cancelledUser,
        'cancelled_timeout' => ContentOrderStatus.cancelledTimeout,
        _ => ContentOrderStatus.pendingPayment,
      };

  String get label => switch (this) {
        ContentOrderStatus.pendingPayment => '待支付',
        ContentOrderStatus.paid => '支付完成',
        ContentOrderStatus.cancelledUser => '已取消',
        ContentOrderStatus.cancelledTimeout => '已取消',
      };

  /// 已取消的细分原因（订单详情/列表副文案用）。
  String? get cancelReason => switch (this) {
        ContentOrderStatus.cancelledUser => '用户取消',
        ContentOrderStatus.cancelledTimeout => '超时未支付',
        _ => null,
      };
}

/// 内容订单。
class ContentOrder {
  const ContentOrder({
    required this.orderId,
    required this.bizType,
    required this.refId,
    required this.title,
    required this.subtitle,
    required this.priceFen,
    required this.status,
    required this.createdAt,
    this.payDeadline,
  });

  /// 订单号（CO 前缀，与预约订单号段区分）。
  final String orderId;

  final ContentOrderBiz bizType;

  /// 课程 ID / 问卷 ID。
  final int refId;

  final String title;
  final String subtitle;

  /// 金额（分）。
  final int priceFen;

  final ContentOrderStatus status;

  /// 创建时间（yyyy-MM-dd HH:mm:ss）。
  final String createdAt;

  /// 支付截止时间（待支付状态有效；超时自动取消）。
  final String? payDeadline;

  String get priceLabel => '¥${(priceFen / 100).toStringAsFixed(priceFen % 100 == 0 ? 0 : 2)}';

  bool get isPending => status == ContentOrderStatus.pendingPayment;
  bool get isPaid => status == ContentOrderStatus.paid;

  ContentOrder copyWith({ContentOrderStatus? status}) => ContentOrder(
        orderId: orderId,
        bizType: bizType,
        refId: refId,
        title: title,
        subtitle: subtitle,
        priceFen: priceFen,
        status: status ?? this.status,
        createdAt: createdAt,
        payDeadline: payDeadline,
      );

  factory ContentOrder.fromJson(Map<String, dynamic> json) => ContentOrder(
        orderId: json['orderId']?.toString() ?? '',
        bizType: ContentOrderBiz.parse(json['bizType']?.toString()),
        refId: (json['refId'] as num?)?.toInt() ?? 0,
        title: json['title']?.toString() ?? '',
        subtitle: json['subtitle']?.toString() ?? '',
        priceFen: (json['priceFen'] as num?)?.toInt() ?? 0,
        status: ContentOrderStatus.parse(json['status']?.toString()),
        createdAt: json['createdAt']?.toString() ?? '',
        payDeadline: json['payDeadline']?.toString(),
      );
}
