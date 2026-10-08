import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/im/im_config.dart';
import '../../core/network/api_response.dart';
import '../../core/router/route_paths.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/app_toast.dart';
import '../ai/ai_settings_page.dart';
import '../chat/widgets/chat_conversation_view.dart';
import '../message/message_view_model.dart';
import '../profile/support_profile_state.dart';
import 'home_models.dart';
import 'home_view_model.dart';
import 'widgets/mood_record_sheet.dart';

class KeluHomeV3Page extends ConsumerStatefulWidget {
  const KeluHomeV3Page({super.key});

  @override
  ConsumerState<KeluHomeV3Page> createState() => _KeluHomeV3PageState();
}

class _KeluHomeV3PageState extends ConsumerState<KeluHomeV3Page> {
  bool _isRecording = false;
  bool _conversationMode = false;
  bool _submittingMood = false;
  bool _soundEnabled = true;
  String? _initialMessage;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      try {
        await ref.read(homeViewModelProvider.notifier).fetchMoodTrend();
      } catch (_) {}
      try {
        await ref.read(homeViewModelProvider.notifier).fetchCampaignBanner();
      } catch (_) {}
    });
  }

  void _openAssistant() => setState(() => _conversationMode = true);

  void _sendFromHome(String text) {
    final value = text.trim();
    if (value.isEmpty) return;
    FocusManager.instance.primaryFocus?.unfocus();
    setState(() {
      _initialMessage = value;
      _conversationMode = true;
    });
  }

  Future<void> _openSettings() async {
    await Navigator.of(context).push<void>(
      MaterialPageRoute<void>(builder: (_) => const AiSettingsPage()),
    );
  }

  void _toggleSound() {
    setState(() => _soundEnabled = !_soundEnabled);
    AppToast.show(context, _soundEnabled ? '小鹿声音已开启' : '小鹿声音已关闭');
  }

  Future<void> _openMoodCheckIn() async {
    final vm = ref.read(homeViewModelProvider.notifier);
    if (!vm.todayIsRecordable) {
      AppToast.show(context, '今天已记录，明天再来看看');
      return;
    }
    final option = await MoodRecordSheet.show(context);
    if (option == null || !mounted || _submittingMood) return;
    setState(() => _submittingMood = true);
    try {
      final message = await vm.submitTodayMood(note: option.title);
      if (!mounted) return;
      AppToast.show(context, message.isEmpty ? '记录成功' : message);
      try {
        await vm.fetchMoodTrend(force: true);
      } catch (_) {}
    } on ApiException catch (error) {
      if (mounted) AppToast.show(context, error.msg);
    } finally {
      if (mounted) setState(() => _submittingMood = false);
    }
  }

  void _finishRecording() {
    setState(() {
      _isRecording = false;
      _conversationMode = true;
    });
  }

  void _openCampaign(HomeCampaignBanner campaign) {
    switch (campaign.targetType) {
      case 'assessment_list':
        context.push(RoutePaths.assessmentList);
        return;
      case 'route':
        if (campaign.targetValue.startsWith('/')) {
          context.push(campaign.targetValue);
        }
        return;
      case 'web':
        if (campaign.targetValue.startsWith('http')) {
          context.push(
            '${RoutePaths.webview}?url=${Uri.encodeComponent(campaign.targetValue)}&title=${Uri.encodeComponent(campaign.title)}',
          );
        }
        return;
    }
  }

  @override
  Widget build(BuildContext context) {
    final campaign = ref.watch(
      homeViewModelProvider.select((state) => state.campaign),
    );
    final unreadCount = ref.watch(messageUnreadTotalProvider);
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F0),
      body: SafeArea(
        bottom: false,
        child: Stack(
          children: [
            Positioned.fill(
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 240),
                switchInCurve: Curves.easeOutCubic,
                switchOutCurve: Curves.easeInCubic,
                child: _conversationMode
                    ? Padding(
                        key: const ValueKey('homeConversation'),
                        padding: const EdgeInsets.only(top: 62),
                        child: Stack(
                          fit: StackFit.expand,
                          children: [
                            Image.asset(
                              'assets/images/home_deer_scene_v2.png',
                              fit: BoxFit.cover,
                              alignment: const Alignment(0.1, -0.15),
                            ),
                            const DecoratedBox(
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  begin: Alignment.topCenter,
                                  end: Alignment.bottomCenter,
                                  colors: [
                                    Color(0xB8F1F5F0),
                                    Color(0xEAF1F5F0),
                                    Color(0xFFF1F5F0),
                                  ],
                                ),
                              ),
                            ),
                            ChatConversationView(
                              peerUserId: ImConfig.robotUserId,
                              peerName: '小鹿',
                              inputEnabled: true,
                              initialText: _initialMessage,
                              conversationHeader: _ConversationCapabilityPanel(
                                onCheckIn: () =>
                                    context.push(RoutePaths.supportCheckIn),
                                onAssessment: () =>
                                    context.push(RoutePaths.assessmentList),
                                onConsultants: () =>
                                    context.push(RoutePaths.supportConsultants),
                                onTools: () =>
                                    context.push(RoutePaths.supportTools),
                              ),
                            ),
                          ],
                        ),
                      )
                    : _AssistantScene(
                        key: const ValueKey('homeWelcome'),
                        isRecording: _isRecording,
                        onMessage: _openAssistant,
                        campaign: campaign,
                        onCampaignTap: _openCampaign,
                        onCheckIn: () =>
                            context.push(RoutePaths.supportCheckIn),
                        onAssessment: () =>
                            context.push(RoutePaths.assessmentList),
                        onConsultants: () =>
                            context.push(RoutePaths.supportConsultants),
                        onPractice: () => context.push(RoutePaths.supportTools),
                        onVoiceStart: () => setState(() => _isRecording = true),
                        onVoiceCancel: () =>
                            setState(() => _isRecording = false),
                        onVoiceEnd: _finishRecording,
                      ),
              ),
            ),
            Positioned(
              left: 0,
              right: 0,
              top: 0,
              child: _TopNavigation(
                onCheckIn: _openMoodCheckIn,
                soundEnabled: _soundEnabled,
                onSoundToggle: _toggleSound,
                unreadCount: unreadCount,
                onMessages: () => context.push(RoutePaths.messages),
                onSettings: _openSettings,
              ),
            ),
            if (!_conversationMode)
              Positioned(
                left: 28,
                right: 28,
                bottom: 18,
                child: _HomeMessageComposer(
                  isRecording: _isRecording,
                  onSend: _sendFromHome,
                  onVoiceStart: () => setState(() => _isRecording = true),
                  onVoiceCancel: () => setState(() => _isRecording = false),
                  onVoiceEnd: _finishRecording,
                ),
              ),
            // 对话模式下欢迎卡（含完善度条）被顶走，保留悬浮小鹿
            // 入口让用户随时可以补档案；完善度满 100% 自动隐藏。
            // 位置：右下角贴近输入条上方的角落，避免挡在消息卡片中间。
            if (_conversationMode)
              const Positioned(
                right: 10,
                bottom: 100,
                child: _FloatingProfileEntry(),
              ),
          ],
        ),
      ),
    );
  }
}

// Legacy comparison state retained temporarily while the inline guide is reviewed.
// ignore: unused_element
class _NewUserGuide extends StatelessWidget {
  const _NewUserGuide({
    required this.onTalk,
    required this.onAssessment,
    required this.onConsultants,
    required this.onPractice,
    required this.onSkip,
  });

  final VoidCallback onTalk;
  final VoidCallback onAssessment;
  final VoidCallback onConsultants;
  final VoidCallback onPractice;
  final VoidCallback onSkip;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 12),
      padding: const EdgeInsets.fromLTRB(20, 18, 20, 18),
      decoration: BoxDecoration(
        color: const Color(0xFFE9F1ED),
        borderRadius: BorderRadius.circular(30),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 72,
                height: 72,
                decoration: const BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                ),
                clipBehavior: Clip.antiAlias,
                child: Image.asset('assets/images/home_mascot.png'),
              ),
              const SizedBox(width: 14),
              const Expanded(
                child: Padding(
                  padding: EdgeInsets.only(top: 5),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Hi，我是小鹿',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w800,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      SizedBox(height: 6),
                      Text(
                        '先了解你此刻需要什么，再陪你找到合适的支持。',
                        style: TextStyle(
                          fontSize: 14,
                          height: 1.45,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              IconButton(
                onPressed: onSkip,
                tooltip: '跳过介绍',
                icon: const Icon(Icons.close_rounded, size: 21),
              ),
            ],
          ),
          const SizedBox(height: 18),
          const Text(
            '你可以从这里开始',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 11),
          Row(
            children: [
              Expanded(
                child: _GuideAction(
                  icon: Icons.chat_bubble_outline_rounded,
                  title: '梳理一下',
                  subtitle: '说说正在发生的事',
                  onTap: onTalk,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _GuideAction(
                  icon: Icons.assignment_outlined,
                  title: '了解自己',
                  subtitle: '选择合适的测评',
                  onTap: onAssessment,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                child: _GuideAction(
                  icon: Icons.people_outline_rounded,
                  title: '找专业支持',
                  subtitle: '匹配咨询师或教练',
                  onTap: onConsultants,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _GuideAction(
                  icon: Icons.air_rounded,
                  title: '先缓一缓',
                  subtitle: '马上做一个短练习',
                  onTap: onPractice,
                ),
              ),
            ],
          ),
          const SizedBox(height: 15),
          SizedBox(
            width: double.infinity,
            height: 54,
            child: FilledButton.icon(
              onPressed: onTalk,
              style: FilledButton.styleFrom(
                backgroundColor: const Color(0xFF173A35),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(17),
                ),
              ),
              icon: const Icon(Icons.mic_none_rounded),
              label: const Text(
                '直接和小鹿说说',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
              ),
            ),
          ),
          const SizedBox(height: 10),
          const Center(
            child: Text(
              '小鹿提供信息整理与支持建议，不替代医疗诊断或治疗。',
              style: TextStyle(fontSize: 11, color: AppColors.textTertiary),
            ),
          ),
        ],
      ),
    );
  }
}

class _GuideAction extends StatelessWidget {
  const _GuideAction({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(17),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(17),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(13, 13, 10, 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(icon, size: 22, color: const Color(0xFF357169)),
              const SizedBox(height: 12),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 3),
              Text(
                subtitle,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontSize: 11,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _TopNavigation extends StatelessWidget {
  const _TopNavigation({
    required this.onCheckIn,
    required this.soundEnabled,
    required this.onSoundToggle,
    required this.unreadCount,
    required this.onMessages,
    required this.onSettings,
  });

  final VoidCallback onCheckIn;
  final bool soundEnabled;
  final VoidCallback onSoundToggle;
  final int unreadCount;
  final VoidCallback onMessages;
  final VoidCallback onSettings;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(10, 10, 12, 12),
      child: Row(
        children: [
          const SizedBox(width: 8),
          const Text(
            '可鹿',
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w800,
              color: AppColors.textPrimary,
            ),
          ),
          const Spacer(),
          Container(
            height: 44,
            padding: const EdgeInsets.symmetric(horizontal: 2),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFFE5E8E5)),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x10000000),
                  blurRadius: 10,
                  offset: Offset(0, 3),
                ),
              ],
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _HeaderAction(
                  tooltip: soundEnabled ? '关闭声音' : '开启声音',
                  icon: soundEnabled
                      ? Icons.volume_up_outlined
                      : Icons.volume_off_outlined,
                  onTap: onSoundToggle,
                ),
                _HeaderAction(
                  tooltip: '记录今天的心情',
                  icon: Icons.edit_calendar_rounded,
                  highlighted: true,
                  onTap: onCheckIn,
                ),
                _HeaderAction(
                  tooltip: '消息',
                  icon: Icons.forum_outlined,
                  badgeCount: unreadCount,
                  onTap: onMessages,
                ),
                _HeaderAction(
                  tooltip: '聊天偏好设置',
                  icon: Icons.more_horiz_rounded,
                  onTap: onSettings,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _HeaderAction extends StatelessWidget {
  const _HeaderAction({
    required this.tooltip,
    required this.icon,
    required this.onTap,
    this.highlighted = false,
    this.badgeCount = 0,
  });

  final String tooltip;
  final IconData icon;
  final VoidCallback onTap;
  final bool highlighted;
  final int badgeCount;

  @override
  Widget build(BuildContext context) => IconButton(
        constraints: const BoxConstraints.tightFor(width: 38, height: 40),
        padding: EdgeInsets.zero,
        tooltip: tooltip,
        onPressed: onTap,
        icon: Badge(
          isLabelVisible: badgeCount > 0,
          label: Text(badgeCount > 99 ? '99+' : '$badgeCount'),
          child: Icon(
            icon,
            size: 21,
            color:
                highlighted ? const Color(0xFF357169) : AppColors.textSecondary,
          ),
        ),
      );
}

class _AssistantScene extends StatelessWidget {
  const _AssistantScene({
    super.key,
    required this.isRecording,
    required this.onMessage,
    required this.campaign,
    required this.onCampaignTap,
    required this.onCheckIn,
    required this.onAssessment,
    required this.onConsultants,
    required this.onPractice,
    required this.onVoiceStart,
    required this.onVoiceCancel,
    required this.onVoiceEnd,
  });

  final bool isRecording;
  final VoidCallback onMessage;
  final HomeCampaignBanner? campaign;
  final ValueChanged<HomeCampaignBanner> onCampaignTap;
  final VoidCallback onCheckIn;
  final VoidCallback onAssessment;
  final VoidCallback onConsultants;
  final VoidCallback onPractice;
  final VoidCallback onVoiceStart;
  final VoidCallback onVoiceCancel;
  final VoidCallback onVoiceEnd;

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFFE7EEE7),
      child: Stack(
        fit: StackFit.expand,
        children: [
          Image.asset(
            'assets/images/home_deer_scene_v2.png',
            fit: BoxFit.cover,
            alignment: const Alignment(0.1, -0.15),
          ),
          const DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color(0x09000000),
                  Color(0x00FFFFFF),
                  Color(0x55F1F5F0),
                  Color(0xFFF1F5F0),
                ],
                stops: [0, 0.28, 0.55, 0.78],
              ),
            ),
          ),
          if (campaign != null)
            Positioned(
              left: 28,
              right: 28,
              top: 76,
              child: _CampaignBanner(
                campaign: campaign!,
                onTap: () => onCampaignTap(campaign!),
              ),
            ),
          Positioned(
            left: 28,
            right: 28,
            top: 228,
            child: Container(
              padding: const EdgeInsets.fromLTRB(16, 36, 16, 20),
              decoration: BoxDecoration(
                color: const Color(0xF2F3F6F1),
                borderRadius: BorderRadius.circular(23),
                border: Border.all(color: const Color(0x99FFFFFF)),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x1213322D),
                    blurRadius: 24,
                    offset: Offset(0, 10),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Hi，我是小鹿',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 5),
                  const Text(
                    '你可以和我聊聊正在经历的事，也可以让我帮你找测评、练习或专业支持。',
                    style: TextStyle(
                      fontSize: 13,
                      height: 1.45,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 15),
                  Row(
                    children: [
                      Expanded(
                        child: _HomeCapability(
                          icon: Icons.chat_bubble_outline_rounded,
                          label: '梳理一下',
                          subtitle: '回答几个简单问题',
                          onTap: onCheckIn,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: _HomeCapability(
                          icon: Icons.assignment_outlined,
                          label: '了解自己',
                          subtitle: '测评与记录',
                          onTap: onAssessment,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(
                        child: _HomeCapability(
                          icon: Icons.people_outline_rounded,
                          label: '找专业支持',
                          subtitle: '咨询师或教练',
                          onTap: onConsultants,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: _HomeCapability(
                          icon: Icons.air_rounded,
                          label: '先缓一缓',
                          subtitle: '选择一个小工具',
                          onTap: onPractice,
                        ),
                      ),
                    ],
                  ),
                  // 档案完善度动态条：<100% 才出现，填完即消失
                  const _ProfileCompletenessBar(),
                ],
              ),
            ),
          ),
          Positioned(
            top: 201,
            left: 0,
            right: 0,
            child: Center(
              child: Container(
                width: 54,
                height: 54,
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 3),
                  boxShadow: const [
                    BoxShadow(color: Color(0x22000000), blurRadius: 14),
                  ],
                ),
                clipBehavior: Clip.antiAlias,
                child: Image.asset('assets/images/home_mascot.png'),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ConversationCapabilityPanel extends StatelessWidget {
  const _ConversationCapabilityPanel({
    required this.onCheckIn,
    required this.onAssessment,
    required this.onConsultants,
    required this.onTools,
  });

  final VoidCallback onCheckIn;
  final VoidCallback onAssessment;
  final VoidCallback onConsultants;
  final VoidCallback onTools;

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.fromLTRB(15, 28, 15, 14),
        child: Stack(
          clipBehavior: Clip.none,
          alignment: Alignment.topCenter,
          children: [
            Container(
              padding: const EdgeInsets.fromLTRB(14, 38, 14, 16),
              decoration: BoxDecoration(
                color: const Color(0xF2F3F6F1),
                borderRadius: BorderRadius.circular(23),
                border: Border.all(color: const Color(0xBFFFFFFF)),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x1413322D),
                    blurRadius: 22,
                    offset: Offset(0, 8),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Hi，我是小鹿',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    '你可以和我聊聊正在经历的事，也可以让我帮你找测评、练习或专业支持。',
                    style: TextStyle(
                      fontSize: 13,
                      height: 1.45,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 14),
                  Row(children: [
                    Expanded(
                      child: _HomeCapability(
                        icon: Icons.chat_bubble_outline_rounded,
                        label: '梳理一下',
                        subtitle: '回答几个简单问题',
                        onTap: onCheckIn,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _HomeCapability(
                        icon: Icons.assignment_outlined,
                        label: '了解自己',
                        subtitle: '测评与记录',
                        onTap: onAssessment,
                      ),
                    ),
                  ]),
                  const SizedBox(height: 8),
                  Row(children: [
                    Expanded(
                      child: _HomeCapability(
                        icon: Icons.people_outline_rounded,
                        label: '找专业支持',
                        subtitle: '咨询师或教练',
                        onTap: onConsultants,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _HomeCapability(
                        icon: Icons.air_rounded,
                        label: '先缓一缓',
                        subtitle: '选择一个小工具',
                        onTap: onTools,
                      ),
                    ),
                  ]),
                ],
              ),
            ),
            Positioned(
              top: -26,
              child: Container(
                width: 58,
                height: 58,
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 3),
                  boxShadow: const [
                    BoxShadow(color: Color(0x22000000), blurRadius: 14),
                  ],
                ),
                clipBehavior: Clip.antiAlias,
                child: Image.asset('assets/images/home_mascot.png'),
              ),
            ),
          ],
        ),
      );
}

class _CampaignBanner extends StatelessWidget {
  const _CampaignBanner({required this.campaign, required this.onTap});

  final HomeCampaignBanner campaign;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => Material(
        color: Colors.white.withValues(alpha: 0.94),
        borderRadius: BorderRadius.circular(18),
        elevation: 2,
        shadowColor: const Color(0x180E302A),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(18),
          child: SizedBox(
            height: 66,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(14, 9, 12, 9),
              child: Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFFE1F3ED), Color(0xFFFFEBD7)],
                      ),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    clipBehavior: Clip.antiAlias,
                    child: campaign.imageUrl?.isNotEmpty == true
                        ? Image.network(
                            campaign.imageUrl!,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => const Icon(
                              Icons.psychology_alt_rounded,
                              color: Color(0xFF357169),
                            ),
                          )
                        : const Icon(
                            Icons.psychology_alt_rounded,
                            color: Color(0xFF357169),
                          ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          campaign.title,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 3),
                        Text(
                          campaign.subtitle,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 11,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    width: 30,
                    height: 30,
                    decoration: const BoxDecoration(
                      color: Color(0xFF357169),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.arrow_forward_rounded,
                      size: 17,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
}

class _HomeCapability extends StatelessWidget {
  const _HomeCapability({
    required this.icon,
    required this.label,
    required this.subtitle,
    required this.onTap,
  });

  final IconData icon;
  final String label;
  final String subtitle;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: const Color(0xFFE9ECE9)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x1013302A),
            blurRadius: 12,
            offset: Offset(0, 5),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(15),
          child: Padding(
            padding: const EdgeInsets.fromLTRB(9, 11, 7, 11),
            child: Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: const Color(0xFFE6F1EE),
                    borderRadius: BorderRadius.circular(11),
                  ),
                  child: Icon(icon, size: 19, color: const Color(0xFF357169)),
                ),
                const SizedBox(width: 9),
                Expanded(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        label,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        subtitle,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 10,
                          color: AppColors.textTertiary,
                        ),
                      ),
                    ],
                  ),
                ),
                const Icon(
                  Icons.chevron_right_rounded,
                  size: 17,
                  color: AppColors.textTertiary,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _HomeMessageComposer extends StatefulWidget {
  const _HomeMessageComposer({
    required this.isRecording,
    required this.onSend,
    required this.onVoiceStart,
    required this.onVoiceCancel,
    required this.onVoiceEnd,
  });

  final bool isRecording;
  final ValueChanged<String> onSend;
  final VoidCallback onVoiceStart;
  final VoidCallback onVoiceCancel;
  final VoidCallback onVoiceEnd;

  @override
  State<_HomeMessageComposer> createState() => _HomeMessageComposerState();
}

class _HomeMessageComposerState extends State<_HomeMessageComposer> {
  final _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _send() {
    final text = _controller.text.trim();
    if (text.isEmpty) return;
    widget.onSend(text);
    _controller.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(28),
      elevation: 2,
      shadowColor: const Color(0x22000000),
      child: SizedBox(
        height: 56,
        child: Row(
          children: [
            const SizedBox(width: 6),
            IconButton(
              onPressed: () => ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('进入对话后可发送图片或文件')),
              ),
              icon: const Icon(Icons.add_rounded),
              color: AppColors.textSecondary,
            ),
            Expanded(
              child: Container(
                height: 42,
                padding: const EdgeInsets.symmetric(horizontal: 10),
                decoration: BoxDecoration(
                  color: const Color(0xFFF5F6F4),
                  borderRadius: BorderRadius.circular(22),
                ),
                child: TextField(
                  controller: _controller,
                  textInputAction: TextInputAction.send,
                  onSubmitted: (_) => _send(),
                  decoration: const InputDecoration(
                    hintText: '和小鹿说说此刻发生的事',
                    hintStyle: TextStyle(
                      fontSize: 14,
                      color: AppColors.textTertiary,
                    ),
                    border: InputBorder.none,
                    isDense: true,
                    contentPadding: EdgeInsets.symmetric(vertical: 12),
                  ),
                ),
              ),
            ),
            GestureDetector(
              onLongPressStart: (_) => widget.onVoiceStart(),
              onLongPressCancel: widget.onVoiceCancel,
              onLongPressEnd: (_) => widget.onVoiceEnd(),
              child: IconButton(
                onPressed: () {},
                tooltip: '按住说话',
                icon: Icon(
                  Icons.graphic_eq_rounded,
                  color: widget.isRecording
                      ? const Color(0xFFE86C55)
                      : const Color(0xFF357169),
                ),
              ),
            ),
            const SizedBox(width: 4),
          ],
        ),
      ),
    );
  }
}

// ignore: unused_element
class _AssistantSceneLegacy extends StatelessWidget {
  const _AssistantSceneLegacy({
    required this.isRecording,
    required this.onMessage,
    required this.onAssessment,
    required this.onConsultants,
    required this.onPractice,
    required this.onVoiceStart,
    required this.onVoiceCancel,
    required this.onVoiceEnd,
  });

  final bool isRecording;
  final VoidCallback onMessage;
  final VoidCallback onAssessment;
  final VoidCallback onConsultants;
  final VoidCallback onPractice;
  final VoidCallback onVoiceStart;
  final VoidCallback onVoiceCancel;
  final VoidCallback onVoiceEnd;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 12),
      height: 505,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(30),
        color: const Color(0xFFDDE8D9),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0D183D36),
            blurRadius: 24,
            offset: Offset(0, 10),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Stack(
        fit: StackFit.expand,
        children: [
          Image.asset(
            'assets/images/home_deer_scene_v2.png',
            fit: BoxFit.cover,
            alignment: const Alignment(0.12, 0.2),
          ),
          const DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color(0x330D2C25),
                  Colors.transparent,
                  Colors.transparent,
                  Color(0x6B102E29),
                ],
                stops: [0, 0.25, 0.63, 1],
              ),
            ),
          ),
          Positioned(
            top: 18,
            left: 16,
            right: 16,
            child: Material(
              color: Colors.white.withValues(alpha: 0.94),
              borderRadius: BorderRadius.circular(22),
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 14, 16, 15),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Hi，我是小鹿',
                      style: TextStyle(
                        fontSize: 18,
                        height: 1.35,
                        fontWeight: FontWeight.w800,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      '我会先了解你此刻需要什么，再陪你找到合适的支持。',
                      style: TextStyle(
                        fontSize: 13,
                        height: 1.45,
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: _BubbleAction(
                            label: '梳理一下',
                            icon: Icons.chat_bubble_outline_rounded,
                            onTap: onMessage,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: _BubbleAction(
                            label: '了解自己',
                            icon: Icons.assignment_outlined,
                            onTap: onAssessment,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(
                          child: _BubbleAction(
                            label: '找专业支持',
                            icon: Icons.people_outline_rounded,
                            onTap: onConsultants,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: _BubbleAction(
                            label: '先缓一缓',
                            icon: Icons.air_rounded,
                            onTap: onPractice,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
          Positioned(
            left: 16,
            right: 16,
            bottom: 16,
            child: Row(
              children: [
                _SquareAction(
                  icon: Icons.chat_bubble_outline_rounded,
                  label: '打字',
                  onTap: onMessage,
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: GestureDetector(
                    onLongPressStart: (_) => onVoiceStart(),
                    onLongPressCancel: onVoiceCancel,
                    onLongPressEnd: (_) => onVoiceEnd(),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 140),
                      height: 58,
                      decoration: BoxDecoration(
                        color: isRecording
                            ? const Color(0xFF244E49)
                            : const Color(0xFF173A35),
                        borderRadius: BorderRadius.circular(18),
                        boxShadow: isRecording
                            ? const [
                                BoxShadow(
                                  color: Color(0x44357169),
                                  blurRadius: 0,
                                  spreadRadius: 6,
                                ),
                              ]
                            : null,
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            isRecording
                                ? Icons.graphic_eq_rounded
                                : Icons.mic_none_rounded,
                            color: Colors.white,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            isRecording ? '松开发送' : '按住说话',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 17,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _BubbleAction extends StatelessWidget {
  const _BubbleAction({
    required this.label,
    required this.icon,
    required this.onTap,
  });

  final String label;
  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: const Color(0xFFF3F6F4),
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
          child: Row(
            children: [
              Icon(icon, size: 17, color: const Color(0xFF357169)),
              const SizedBox(width: 7),
              Expanded(
                child: Text(
                  label,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SquareAction extends StatelessWidget {
  const _SquareAction({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  final IconData icon;
  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(18),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(18),
        child: SizedBox(
          width: 64,
          height: 58,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 21, color: const Color(0xFF173A35)),
              const SizedBox(height: 2),
              Text(
                label,
                style: const TextStyle(
                  fontSize: 11,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// Legacy comparison state retained temporarily while the inline guide is reviewed.
// ignore: unused_element
class _QuickEntry extends StatelessWidget {
  const _QuickEntry({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.color,
    required this.onTap,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(right: 10),
      child: Material(
        color: color,
        borderRadius: BorderRadius.circular(18),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(18),
          child: SizedBox(
            width: 184,
            child: Padding(
              padding: const EdgeInsets.all(15),
              child: Row(
                children: [
                  Container(
                    width: 42,
                    height: 42,
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.72),
                      borderRadius: BorderRadius.circular(13),
                    ),
                    child: Icon(icon, size: 22, color: const Color(0xFF356B65)),
                  ),
                  const SizedBox(width: 11),
                  Expanded(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: const TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          subtitle,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 12,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// 支持档案完善度动态条：整体完善度 <100% 时才出现，
/// 点击进支持档案页；填完即消失（不占固定位）。
class _ProfileCompletenessBar extends ConsumerWidget {
  const _ProfileCompletenessBar();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profile = ref.watch(supportProfileProvider);
    final percent = ((profile.basicCompletion +
                profile.preferenceCompletion +
                profile.supportCompletion) /
            3)
        .round();
    if (percent >= 100) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.only(top: 12),
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: () => context.push(RoutePaths.supportProfile),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
          decoration: BoxDecoration(
            color: const Color(0xFFE7F1ED),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(
            children: [
              const Icon(Icons.tune_rounded,
                  size: 18, color: Color(0xFF286D64)),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      '小鹿还不太懂你',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF286D64),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '完善支持档案，推荐会更准',
                      style: TextStyle(
                        fontSize: 11,
                        color: const Color(0xFF286D64).withValues(alpha: 0.75),
                      ),
                    ),
                  ],
                ),
              ),
              SizedBox(
                width: 38,
                height: 38,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    CircularProgressIndicator(
                      value: percent / 100,
                      strokeWidth: 3.5,
                      backgroundColor: Colors.white,
                      valueColor: const AlwaysStoppedAnimation<Color>(
                          Color(0xFF286D64)),
                    ),
                    Text(
                      '$percent%',
                      style: const TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF286D64),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 4),
              const Icon(Icons.chevron_right_rounded,
                  size: 20, color: Color(0xFF286D64)),
            ],
          ),
        ),
      ),
    );
  }
}

/// 对话模式下的悬浮档案入口：小鹿头像 + 完善度气泡。
/// 完善度 <100% 才出现，点击进入支持档案完善页。
class _FloatingProfileEntry extends ConsumerWidget {
  const _FloatingProfileEntry();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profile = ref.watch(supportProfileProvider);
    final percent = ((profile.basicCompletion +
                profile.preferenceCompletion +
                profile.supportCompletion) /
            3)
        .round();
    if (percent >= 100) return const SizedBox.shrink();
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: () => context.push(RoutePaths.supportProfile),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFDCE8E2)),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x14000000),
                  blurRadius: 8,
                  offset: Offset(0, 2),
                ),
              ],
            ),
            child: Text(
              '补充档案 · $percent%',
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: Color(0xFF286D64),
              ),
            ),
          ),
          const SizedBox(height: 6),
          Stack(
            clipBehavior: Clip.none,
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white,
                  border: Border.all(color: const Color(0xFFDCE8E2)),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x14000000),
                      blurRadius: 8,
                      offset: Offset(0, 2),
                    ),
                  ],
                ),
                child: ClipOval(
                  child: Image.asset(
                    'assets/images/home_mascot.png',
                    fit: BoxFit.cover,
                  ),
                ),
              ),
              const Positioned(
                right: 0,
                top: 0,
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Color(0xFFE9685B),
                  ),
                  child: SizedBox(width: 10, height: 10),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
