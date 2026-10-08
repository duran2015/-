import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/app_mode.dart';
import '../../core/auth/auth_controller.dart';
import '../../core/network/api_env.dart';
import '../../core/network/api_response.dart';
import '../../core/network/dev_mock.dart';
import '../../core/router/route_paths.dart';
import '../../core/storage/account_store.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/widgets/app_toast.dart';
import 'auth_view_model.dart';
import 'widgets/agreement_dialog.dart';

/// 小程序形态登录页（AppMode.isMiniProgram 时替换 [LoginPage]）。
///
/// 携程授权模式：
/// 1. 主视图：协议勾选 + 「授权手机号登录」主按钮 + 验证码/社交账号次入口；
/// 2. 授权弹层：微信 getPhoneNumber 半屏（演示用仿微信样式面板，
///    真实小程序由微信原生组件承载），选号即登录；
/// 3. 验证码登录兜底：手机号 + 短信验证码（复用 [VerifyCodePage]）。
///
/// 与 App 版差异：无「我是咨询师」身份切换入口（小程序只做用户端）。
class MpLoginPage extends ConsumerStatefulWidget {
  const MpLoginPage({super.key});

  @override
  ConsumerState<MpLoginPage> createState() => _MpLoginPageState();
}

class _MpLoginPageState extends ConsumerState<MpLoginPage> {
  bool _agreed = false;
  bool _smsMode = false;
  final _phoneController = TextEditingController();

  bool get _phoneValid =>
      RegExp(r'^1[3-9]\d{9}$').hasMatch(_phoneController.text.trim());

  @override
  void initState() {
    super.initState();
    _phoneController.addListener(() => setState(() {}));
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(authViewModelProvider.notifier).loadLatestAgreements();
    });
  }

  @override
  void dispose() {
    _phoneController.dispose();
    super.dispose();
  }

  /// 授权号码（或验证码校验）成功后落地登录态并分流。
  Future<void> _applyLogin(String phone) async {
    // mock 演示：直接落地假登录态；真实小程序由 getPhoneNumber 的
    // code 换后端登录态（authApi.loginByMpPhone，待后端接入）。
    if (ApiEnv.isMock) {
      await ref.read(authControllerProvider.notifier).applyLogin(
            LoginData.fromJson(devMockLoginData(phone, dual: false)),
          );
      if (!mounted) return;
      final data = ref.read(authControllerProvider);
      context.go(resolveEntryRoute(data));
      return;
    }
    AppToast.show(context, '小程序授权登录待后端接入');
  }

  /// 「授权手机号登录」：未同意协议先提示；同意后弹出仿微信授权面板。
  Future<void> _onWxAuthTapped() async {
    if (!_agreed) {
      AppToast.show(context, '请先阅读并同意协议');
      return;
    }
    final phone = await showModalBottomSheet<String>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const _MpPhoneAuthSheet(),
    );
    if (phone == null || !mounted) return;
    AppToast.show(context, '授权成功，正在登录…');
    await _applyLogin(phone);
  }

  /// 验证码登录：发送短信 → 验证码页（与 App 版共用）。
  Future<void> _onGetCodeTapped() async {
    if (!_agreed) {
      AppToast.show(context, '请先阅读并同意协议');
      return;
    }
    if (!_phoneValid) {
      AppToast.show(context, '请输入正确的手机号');
      return;
    }
    try {
      await ref
          .read(authViewModelProvider.notifier)
          .sendLoginSmsCode(_phoneController.text.trim());
      if (!mounted) return;
      context.push(
        '${RoutePaths.loginVerify}?phone=${_phoneController.text.trim()}',
      );
    } on ApiException catch (e) {
      if (mounted) AppToast.show(context, e.msg);
    } catch (_) {
      if (mounted) AppToast.show(context, '网络异常，请稍后重试');
    }
  }

  @override
  Widget build(BuildContext context) {
    final vmState = ref.watch(authViewModelProvider);
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 28),
          child: Column(
            children: [
              const SizedBox(height: 110),
              // 小鹿形象
              Container(
                width: 84,
                height: 84,
                decoration: const BoxDecoration(
                  color: Color(0xFFE7F1ED),
                  shape: BoxShape.circle,
                ),
                alignment: Alignment.center,
                child: const Text('🦌', style: TextStyle(fontSize: 42)),
              ),
              const SizedBox(height: 18),
              Text(
                '账号安全，放心登录',
                style: AppTextStyles.bodyLarge.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
              const Spacer(),
              if (_smsMode) ...[
                _buildSmsPanel(),
                const SizedBox(height: 18),
              ] else ...[
                _buildAgreement(vmState),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: FilledButton(
                    style: FilledButton.styleFrom(
                      backgroundColor: AppColors.brandTeal,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(25),
                      ),
                    ),
                    onPressed: _onWxAuthTapped,
                    child: const Text('授权手机号登录',
                        style: TextStyle(
                            fontSize: 16, fontWeight: FontWeight.w600)),
                  ),
                ),
              ],
              const SizedBox(height: 18),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  GestureDetector(
                    onTap: () => setState(() => _smsMode = !_smsMode),
                    child: Text(
                      _smsMode ? '返回授权登录' : '手机验证码登录',
                      style: AppTextStyles.body.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ),
                  GestureDetector(
                    onTap: () =>
                        AppToast.show(context, '小程序内请使用手机号登录'),
                    child: Text(
                      '社交账号登录',
                      style: AppTextStyles.body.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ),
                ],
              ),
              const Spacer(),
              Text(
                '可鹿心理 · 关注最真实的自己',
                style: AppTextStyles.caption.copyWith(
                  color: AppColors.textTertiary,
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAgreement(AuthViewState vmState) {
    return AgreementConsentRow(
      agreed: _agreed,
      serviceUrl: vmState.serviceAgreementUrl,
      privacyUrl: vmState.privacyPolicyUrl,
      onChanged: (v) => setState(() => _agreed = v),
    );
  }

  Widget _buildSmsPanel() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('手机验证码登录',
            style: AppTextStyles.titleXLarge.copyWith(fontSize: 22)),
        const SizedBox(height: 6),
        Text(
          '未注册的手机号验证通过后将自动创建可鹿账户',
          style: AppTextStyles.caption
              .copyWith(color: AppColors.textTertiary),
        ),
        const SizedBox(height: 20),
        Container(
          height: 52,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: const Color(0xFFF7F8F7),
            borderRadius: BorderRadius.circular(14),
          ),
          alignment: Alignment.center,
          child: TextField(
            controller: _phoneController,
            keyboardType: TextInputType.phone,
            inputFormatters: [
              FilteringTextInputFormatter.digitsOnly,
              LengthLimitingTextInputFormatter(11),
            ],
            style: const TextStyle(fontSize: 16),
            decoration: const InputDecoration(
              border: InputBorder.none,
              hintText: '请输入手机号',
              isCollapsed: true,
            ),
          ),
        ),
        const SizedBox(height: 16),
        SizedBox(
          width: double.infinity,
          height: 50,
          child: FilledButton(
            style: FilledButton.styleFrom(
              backgroundColor: _phoneValid
                  ? AppColors.brandTeal
                  : const Color(0xFFC9D6D1),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(25),
              ),
            ),
            onPressed: _onGetCodeTapped,
            child:
                const Text('获取验证码', style: TextStyle(fontSize: 16)),
          ),
        ),
      ],
    );
  }
}

/// 仿微信 getPhoneNumber 半屏授权面板（演示）。
/// 真实小程序中此面板由微信原生组件承载，这里仅还原交互与文案。
class _MpPhoneAuthSheet extends StatelessWidget {
  const _MpPhoneAuthSheet();

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(22)),
      ),
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 30),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 26,
                height: 26,
                decoration: const BoxDecoration(
                  color: AppColors.brandTeal,
                  shape: BoxShape.circle,
                ),
                alignment: Alignment.center,
                child: const Text('鹿',
                    style: TextStyle(color: Colors.white, fontSize: 13)),
              ),
              const SizedBox(width: 9),
              const Text('可鹿心理',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
              const Spacer(),
              const Icon(Icons.info_outline,
                  size: 16, color: Color(0xFFB8C6C0)),
            ],
          ),
          const SizedBox(height: 16),
          const Text('申请获取并验证你的手机号',
              style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700)),
          const SizedBox(height: 10),
          const Text(
            '若你想使用可鹿心理的产品/服务，需要注册一个可鹿账户。注册时需提供手机号'
            '（用于接收短信验证码）以创建账户。如拒绝提供手机号，你将无法预约咨询、'
            '解锁测评完整报告、购买课程及接收订单相关通知，但不影响你正常浏览'
            '与体验部分内容。',
            style:
                TextStyle(fontSize: 12, color: Color(0xFF8A9691), height: 1.75),
          ),
          const SizedBox(height: 16),
          _phoneOption(context, '138****7607', lastUsed: true),
          const SizedBox(height: 10),
          _phoneOption(context, '199****0686'),
          const SizedBox(height: 10),
          GestureDetector(
            onTap: () => Navigator.of(context).pop(),
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 15),
              decoration: BoxDecoration(
                color: const Color(0xFFF7F8F7),
                borderRadius: BorderRadius.circular(14),
              ),
              alignment: Alignment.center,
              child: const Text('不允许', style: TextStyle(fontSize: 15)),
            ),
          ),
          const SizedBox(height: 16),
          Center(
            child: GestureDetector(
              onTap: () => AppToast.show(context, '微信原生号码管理（演示）'),
              child: const Text('管理号码',
                  style:
                      TextStyle(fontSize: 12.5, color: Color(0xFF8A9691))),
            ),
          ),
        ],
      ),
    );
  }

  Widget _phoneOption(BuildContext context, String masked,
      {bool lastUsed = false}) {
    return GestureDetector(
      onTap: () => Navigator.of(context).pop(masked.replaceAll('*', '0')),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: const Color(0xFFF7F8F7),
          borderRadius: BorderRadius.circular(14),
        ),
        alignment: Alignment.center,
        child: Column(
          children: [
            Text(masked,
                style: const TextStyle(fontSize: 17, letterSpacing: 1)),
            if (lastUsed) ...[
              const SizedBox(height: 4),
              const Text('上次提供',
                  style: TextStyle(fontSize: 11, color: Color(0xFF38C172))),
            ],
          ],
        ),
      ),
    );
  }
}
