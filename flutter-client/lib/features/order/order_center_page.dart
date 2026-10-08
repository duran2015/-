import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/router/route_paths.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_dimens.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/widgets/app_dialog.dart';
import '../../core/widgets/app_nav_bar.dart';
import '../../core/widgets/app_states.dart';
import '../../core/widgets/app_toast.dart';
import '../payment/payment_view_model.dart';
import 'content_order_api.dart';
import 'content_order_models.dart';
import 'my_orders_page.dart';

/// 订单中心（路由 /orders/center）：测评订单 / 课程订单 / 预约订单 三 Tab。
///
/// - 测评/课程订单走内容订单链路（/app/content-order/*），
///   状态机：待支付 / 支付完成 / 已取消（用户取消、超时未支付）。
/// - 预约订单复用 [AppointmentOrderListView]（/app/consultant/order/my-list）。
class OrderCenterPage extends StatelessWidget {
  const OrderCenterPage({super.key, this.initialTab = 0});

  /// 初始 Tab：0=测评订单，1=课程订单，2=预约订单。
  final int initialTab;

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      initialIndex: initialTab.clamp(0, 2),
      child: Scaffold(
        backgroundColor: const Color(0xFFFAF8F5),
        body: SafeArea(
          bottom: false,
          child: Column(
            children: [
              const AppNavBar(title: '我的订单'),
              const TabBar(
                labelColor: AppColors.brandTeal,
                unselectedLabelColor: AppColors.textSecondary,
                indicatorColor: AppColors.brandTeal,
                indicatorSize: TabBarIndicatorSize.label,
                tabs: [
                  Tab(text: '测评订单'),
                  Tab(text: '课程订单'),
                  Tab(text: '预约订单'),
                ],
              ),
              const Expanded(
                child: TabBarView(
                  children: [
                    ContentOrderListView(bizType: ContentOrderBiz.assessment),
                    ContentOrderListView(bizType: ContentOrderBiz.course),
                    AppointmentOrderListView(),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// 内容订单列表（测评/课程通用）：下拉刷新 + 状态标签 +
/// 待支付「去支付/取消」、已取消原因、已支付快捷入口。
class ContentOrderListView extends ConsumerWidget {
  const ContentOrderListView({super.key, required this.bizType});

  final ContentOrderBiz bizType;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ordersAsync = ref.watch(contentOrderListProvider(bizType));
    return ordersAsync.when(
      loading: () => const AppLoadingView(),
      error: (e, _) => AppErrorView(
        message: '订单加载失败',
        onRetry: () => ref.invalidate(contentOrderListProvider(bizType)),
      ),
      data: (orders) {
        if (orders.isEmpty) {
          return RefreshIndicator(
            onRefresh: () async =>
                ref.invalidate(contentOrderListProvider(bizType)),
            child: ListView(
              physics: const AlwaysScrollableScrollPhysics(),
              children: [
                SizedBox(
                  height: MediaQuery.of(context).size.height * 0.5,
                  child: AppEmptyView(
                    message:
                        bizType == ContentOrderBiz.course ? '暂无课程订单' : '暂无测评订单',
                  ),
                ),
              ],
            ),
          );
        }
        return RefreshIndicator(
          onRefresh: () async =>
              ref.invalidate(contentOrderListProvider(bizType)),
          child: ListView.builder(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.fromLTRB(15, 10, 15, 24),
            itemCount: orders.length,
            itemBuilder: (context, index) => ContentOrderCard(
              order: orders[index],
              bizType: bizType,
            ),
          ),
        );
      },
    );
  }
}

/// 内容订单卡片。
class ContentOrderCard extends ConsumerWidget {
  const ContentOrderCard({
    super.key,
    required this.order,
    required this.bizType,
  });

  final ContentOrder order;
  final ContentOrderBiz bizType;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        borderRadius: BorderRadius.circular(AppDimens.cardRadius),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  order.title,
                  style: AppTextStyles.bodyLargeStrong,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              _StatusChip(order: order),
            ],
          ),
          if (order.subtitle.isNotEmpty) ...[
            const SizedBox(height: 6),
            Text(
              order.subtitle,
              style: AppTextStyles.label.copyWith(
                color: AppColors.textSecondary,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ],
          const SizedBox(height: 10),
          Row(
            children: [
              Text(
                order.priceLabel,
                style: AppTextStyles.titleSmall.copyWith(
                  color: AppColors.priceRed,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  order.createdAt,
                  style: AppTextStyles.caption.copyWith(
                    color: AppColors.textTertiary,
                  ),
                ),
              ),
              ..._actions(context, ref),
            ],
          ),
        ],
      ),
    );
  }

  List<Widget> _actions(BuildContext context, WidgetRef ref) {
    if (order.isPending) {
      return [
        _outlineButton('取消订单', () => _cancel(context, ref)),
        const SizedBox(width: 8),
        _primaryButton('去支付', () => _pay(context, ref)),
      ];
    }
    if (order.isPaid) {
      return [
        _primaryButton(
          bizType == ContentOrderBiz.course ? '去学习' : '查看报告',
          () => _openContent(context),
        ),
      ];
    }
    return const [];
  }

  Widget _primaryButton(String text, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 7),
        decoration: BoxDecoration(
          gradient: AppColors.brandGradient,
          borderRadius: BorderRadius.circular(99),
        ),
        child: Text(
          text,
          style: AppTextStyles.label.copyWith(
            color: Colors.white,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }

  Widget _outlineButton(String text, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 7),
        decoration: BoxDecoration(
          border: Border.all(color: AppColors.dividerDark),
          borderRadius: BorderRadius.circular(99),
        ),
        child: Text(
          text,
          style: AppTextStyles.label.copyWith(color: AppColors.textSecondary),
        ),
      ),
    );
  }

  /// 去支付：带完整订单字段跳统一支付确认页；返回后刷新列表。
  Future<void> _pay(BuildContext context, WidgetRef ref) async {
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
    // 支付成功页 go() 换栈时本组件已卸载，先判 mounted 再刷新
    if (!context.mounted) return;
    ref.invalidate(contentOrderListProvider(bizType));
  }

  /// 取消订单：确认弹窗 → /app/content-order/cancel → 刷新列表。
  Future<void> _cancel(BuildContext context, WidgetRef ref) async {
    final confirmed = await AppCenterDialog.show(
      context,
      title: '取消订单',
      content: '确定要取消这笔订单吗？',
      cancelText: '再想想',
      confirmText: '确定取消',
    );
    if (confirmed != true || !context.mounted) return;
    final ok = await ref.read(contentOrderApiProvider).cancel(order.orderId);
    if (!context.mounted) return;
    AppToast.show(context, ok ? '订单已取消' : '取消失败，请稍后重试');
    ref.invalidate(contentOrderListProvider(bizType));
  }

  /// 已支付快捷入口：课程 → 课程详情；测评 → 完整报告。
  void _openContent(BuildContext context) {
    if (bizType == ContentOrderBiz.course) {
      context.push('${RoutePaths.courseDetail}?id=${order.refId}');
    } else {
      context.push(
        Uri(path: RoutePaths.assessmentReport, queryParameters: {
          'assessmentId': '${order.refId}',
          'title': order.title,
        }).toString(),
      );
    }
  }
}

/// 订单状态标签：待支付（橙）/ 支付完成（青）/ 已取消（灰，含原因）。
class _StatusChip extends StatelessWidget {
  const _StatusChip({required this.order});

  final ContentOrder order;

  @override
  Widget build(BuildContext context) {
    final (bg, fg) = switch (order.status) {
      ContentOrderStatus.pendingPayment => (
          const Color(0xFFFFF3EA),
          const Color(0xFF8A5B3D)
        ),
      ContentOrderStatus.paid => (
          const Color(0xFFE7F1ED),
          const Color(0xFF286D64)
        ),
      _ => (const Color(0xFFF1F1EF), AppColors.textTertiary),
    };
    final reason = order.status.cancelReason;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(99),
      ),
      child: Text(
        reason == null ? order.status.label : '${order.status.label}·$reason',
        style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: fg),
      ),
    );
  }
}
