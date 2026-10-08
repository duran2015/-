import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/network/api_response.dart';
import '../../core/router/route_paths.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_dimens.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/widgets/app_dialog.dart';
import '../../core/widgets/app_nav_bar.dart';
import '../../core/widgets/app_toast.dart';
import '../order/order_api.dart';
import '../course/course_view_model.dart';
import '../order/content_order_api.dart';
import '../order/content_order_models.dart';

/// 支付成功页（路由 /payment/success?name=&time=&orderId=）。
/// iOS 参照：XYAIModule/XYAIModule/Classes/ViewController/
/// XYPaymentSuccessViewController.swift（Figma「支付成功-0715」1173:2859）——
/// 日历勾选图标 + 「预约成功」+ 提醒文案 + 预订信息卡（倾听师/预约时间）
/// + 主按钮「填写咨询前问卷」+ 次按钮「稍后填写并返回首页」+ 退单链接。
///
/// 内容订单（bizType=course/assessment）走变体：
/// 「购买成功/解锁成功」+ 主按钮「开始学习/查看完整报告」，无退单链接。
class PaymentSuccessPage extends ConsumerWidget {
  const PaymentSuccessPage({
    super.key,
    required this.counselorName,
    required this.appointmentTime,
    required this.orderId,
    this.counselorIMUserID = '',
    this.counselorAvatar,
    this.bizType = 'consult',
    this.contentTitle = '',
    this.contentRefId = 0,
  });

  final String counselorName;
  final String appointmentTime;
  final String orderId;

  /// 咨询师 IM 用户 ID（咨询前问卷提交成功后跳转聊天用，
  /// iOS XYPaymentSuccessViewModel.counselorIMUserID）
  final String counselorIMUserID;

  /// 咨询师头像 URL（iOS counselorAvatar）
  final String? counselorAvatar;

  /// 业务类型：consult（默认）/ course / assessment
  final String bizType;

  /// 内容订单商品名（课程名 / 测评名）
  final String contentTitle;

  /// 内容订单商品 ID（课程 ID / 问卷 ID，跳转目标用）
  final int contentRefId;

  bool get _isCourse => bizType == 'course';
  bool get _isAssessment => bizType == 'assessment';
  bool get _isContentOrder => _isCourse || _isAssessment;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (_isContentOrder) return _buildContentSuccess(context, ref);
    return _buildConsultSuccess(context, ref);
  }

  /// 内容订单支付成功页（课程购买 / 测评报告解锁）。
  Widget _buildContentSuccess(BuildContext context, WidgetRef ref) {
    return PopScope(
      canPop: false,
      child: Scaffold(
        backgroundColor: AppColors.pageBackground,
        body: SafeArea(
          child: Column(
            children: [
              const AppNavBar(
                  title: '支付成功', showBack: false, transparent: true),
              Expanded(
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.symmetric(horizontal: 15),
                  child: Column(
                    children: [
                      const SizedBox(height: 30),
                      Icon(
                        _isCourse
                            ? Icons.play_circle_outline
                            : Icons.assignment_turned_in_outlined,
                        size: 32,
                        color: AppColors.brandTeal,
                      ),
                      const SizedBox(height: 10),
                      Text(
                        _isCourse ? '购买成功' : '解锁成功',
                        style: AppTextStyles.titleXLarge,
                      ),
                      const SizedBox(height: 6),
                      Text(
                        _isCourse ? '课程已加入你的学习列表，可随时回看' : '完整测评报告已解锁，可随时查看',
                        style: AppTextStyles.body.copyWith(
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 20),
                      _contentOrderCard(),
                      const SizedBox(height: 33),
                      GestureDetector(
                        key: const Key('content_success_primary'),
                        onTap: () => _goContentTarget(context, ref),
                        child: Container(
                          height: AppDimens.confirmButtonHeight,
                          decoration: BoxDecoration(
                            gradient: AppColors.brandGradient,
                            borderRadius: BorderRadius.circular(
                              AppDimens.confirmButtonRadius,
                            ),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            _isCourse ? '开始学习' : '查看完整报告',
                            style: AppTextStyles.titleLarge.copyWith(
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 10),
                      GestureDetector(
                        onTap: () => context.go(RoutePaths.home),
                        child: Container(
                          height: 45,
                          alignment: Alignment.center,
                          child: Text(
                            '返回首页',
                            style: AppTextStyles.titleSmall.copyWith(
                              color: AppColors.textTertiary,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  /// 内容订单信息卡：订单信息标题 + 商品/订单编号两行。
  Widget _contentOrderCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(15, 20, 15, 20),
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        borderRadius: BorderRadius.circular(AppDimens.cardRadius),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '订单信息',
            style: AppTextStyles.bodyLargeStrong.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 18),
          _infoRow(_isCourse ? '课程' : '测评', contentTitle),
          const SizedBox(height: 12),
          _infoRow('订单编号', orderId),
        ],
      ),
    );
  }

  /// 支付成功后跳转：课程 → 课程详情；测评 → 完整报告页。
  /// 先使相关缓存失效（课程详情/列表的购买标识、内容订单列表），
  /// 否则上一页入栈时的缓存会让详情页仍显示未购买。
  void _goContentTarget(BuildContext context, WidgetRef ref) {
    ref.invalidate(courseDetailProvider(contentRefId));
    ref.invalidate(courseListProvider);
    ref.invalidate(contentOrderListProvider(ContentOrderBiz.course));
    ref.invalidate(contentOrderListProvider(ContentOrderBiz.assessment));
    if (_isCourse) {
      context.go(
        Uri(path: RoutePaths.courseDetail, queryParameters: {
          'id': '$contentRefId',
        }).toString(),
      );
    } else {
      context.go(
        Uri(path: RoutePaths.assessmentReport, queryParameters: {
          'assessmentId': '$contentRefId',
          if (contentTitle.isNotEmpty) 'title': contentTitle,
        }).toString(),
      );
    }
  }

  Widget _buildConsultSuccess(BuildContext context, WidgetRef ref) {
    return PopScope(
      canPop: false, // iOS 参照：disableNavigationBack
      child: Scaffold(
        backgroundColor: AppColors.pageBackground,
        // 导航栏内嵌 body 顶部 + SafeArea（参照 06/07/10 页写法）
        body: SafeArea(
          child: Column(
            children: [
              const AppNavBar(
                  title: '支付成功', showBack: false, transparent: true),
              Expanded(
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.symmetric(horizontal: 15),
                  child: Column(
                    children: [
                      const SizedBox(height: 30),
                      // 日历勾选图标（iOS ic_pay_success_check 为 svg，
                      // 工程未引入 svg 渲染，用 iOS fallbackSystemName
                      // "calendar.badge.checkmark" 等价 Icons 代替，tint #00A6A1）
                      const Icon(
                        Icons.event_available_outlined,
                        size: 32,
                        color: AppColors.brandTeal,
                      ),
                      const SizedBox(height: 10),
                      Text('预约成功', style: AppTextStyles.titleXLarge),
                      const SizedBox(height: 6),
                      // iOS 参照：XYPaymentSuccessViewModel.reminderText
                      Text(
                        '请提前 5 分钟进入咨询室准备',
                        style: AppTextStyles.body.copyWith(
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 20),
                      _orderCard(),
                      const SizedBox(height: 12),
                      _sharingNotice(context),
                      const SizedBox(height: 33),
                      // 主按钮：填写咨询前问卷（青渐变 53 高胶囊，18 semibold）
                      // iOS 参照：questionnaireTapped → XYIntakeWebViewController
                      GestureDetector(
                        key: const Key('fill_questionnaire'),
                        onTap: () => _openQuestionnaire(context),
                        child: Container(
                          height: AppDimens.confirmButtonHeight,
                          decoration: BoxDecoration(
                            gradient: AppColors.brandGradient,
                            borderRadius: BorderRadius.circular(
                              AppDimens.confirmButtonRadius,
                            ),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            '填写咨询前问卷',
                            style: AppTextStyles.titleLarge.copyWith(
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 10),
                      // 次按钮：稍后填写并返回首页（15 semibold #999）
                      GestureDetector(
                        onTap: () => context.go(RoutePaths.home),
                        child: Container(
                          height: 45,
                          alignment: Alignment.center,
                          child: Text(
                            '稍后填写并返回首页',
                            style: AppTextStyles.titleSmall.copyWith(
                              color: AppColors.textTertiary,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),
                      // 申请退单链接（12 #00A6A1）
                      GestureDetector(
                        onTap: () => _refund(context, ref),
                        child: Container(
                          height: 30,
                          alignment: Alignment.center,
                          child: Text(
                            '申请退单并取消预约',
                            style: AppTextStyles.caption.copyWith(
                              color: AppColors.brandTeal,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  /// 预订信息卡：标题（14 semibold #666）+ 倾听师/预约时间两行键值。
  /// iOS 参照：makeOrderCard / makeInfoRow。
  Widget _orderCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(15, 20, 15, 20),
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        borderRadius: BorderRadius.circular(AppDimens.cardRadius),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '预订信息',
            style: AppTextStyles.bodyLargeStrong.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 18),
          _infoRow('倾听师', counselorName),
          const SizedBox(height: 12),
          _infoRow('预约时间', appointmentTime),
        ],
      ),
    );
  }

  Widget _sharingNotice(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Theme.of(context)
            .colorScheme
            .secondaryContainer
            .withValues(alpha: .58),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.shield_outlined,
              size: 20, color: Theme.of(context).colorScheme.primary),
          const SizedBox(width: 10),
          const Expanded(
            child: Text(
              '咨询前资料为选填。提交前会展示本次分享内容，仅提供给本次咨询师。',
              style: TextStyle(fontSize: 12, height: 1.45),
            ),
          ),
        ],
      ),
    );
  }

  Widget _infoRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: AppTextStyles.bodyLarge.copyWith(
            color: AppColors.textSecondary,
          ),
        ),
        const SizedBox(width: 12),
        Flexible(
          child: Text(
            value,
            style: AppTextStyles.bodyLargeStrong,
            textAlign: TextAlign.right,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }

  /// 填写咨询前问卷：打开 H5 问卷容器（iOS questionnaireTapped；
  /// orderId 缺失 → Toast「订单号缺失，请稍后重试」）
  void _openQuestionnaire(BuildContext context) {
    if (orderId.isEmpty) {
      AppToast.show(context, '订单号缺失，请稍后重试');
      return;
    }
    context.push(
      Uri(path: RoutePaths.paymentIntake, queryParameters: {
        'orderId': orderId,
        if (counselorIMUserID.isNotEmpty) 'imUserId': counselorIMUserID,
        if (counselorName.isNotEmpty) 'name': counselorName,
        if (counselorAvatar != null && counselorAvatar!.isNotEmpty)
          'avatar': counselorAvatar!,
      }).toString(),
    );
  }

  /// 申请退单：确认弹窗 → /app/consultant/order/cancel → Toast + 返回首页。
  /// iOS 参照：refundTapped（XYCenterAlertView.showConfirm confirmDestructive）。
  Future<void> _refund(BuildContext context, WidgetRef ref) async {
    final confirmed = await AppCenterDialog.show(
      context,
      title: '申请退单',
      content: '确定要申请退单并取消本次预约吗？',
      cancelText: '再想想',
      confirmText: '确定退单',
    );
    if (confirmed != true || !context.mounted) return;
    try {
      await ref.read(orderApiProvider).cancelOrder(orderId);
      if (!context.mounted) return;
      AppToast.show(context, '取消预约成功');
      context.go(RoutePaths.home);
    } on ApiException catch (e) {
      if (!context.mounted) return;
      AppToast.show(context, e.msg.isEmpty ? '取消失败' : e.msg);
    } catch (_) {
      if (!context.mounted) return;
      AppToast.show(context, '取消失败');
    }
  }
}
