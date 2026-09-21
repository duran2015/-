import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/widgets/app_tab_bar.dart';
import '../consultant/consultant_list_page.dart';
import '../home/assessment_list_page.dart';
import '../home/home_page.dart';
import '../message/message_view_model.dart';
import '../mine/mine_page.dart';
import '../service/service_page.dart';

/// 可鹿 3.0 主壳：首页 / 真人支持 / 测评 / 课程练习 / 我的。
/// - 消息 Tab 角标 = 普通对话未读总数（不含机器人与系统通知），
///   iOS 参照：XYUnreadMessageTotalChanged 通知 → Tab 角标。
class MainShellPage extends ConsumerStatefulWidget {
  const MainShellPage({
    super.key,
    this.initialTab = 0,
    this.newcomerInterpretation = false,
  });

  /// 支持外部指定根 Tab。
  final int initialTab;

  /// 保留旧营销路由参数兼容，不改变消息与我的页面。
  final bool newcomerInterpretation;

  @override
  ConsumerState<MainShellPage> createState() => _MainShellPageState();
}

/// 联调驱动接口（IM 复验走查专用）：供 app/navigation.dart 的元素树
/// 查找器定位主壳 State 并切换底部 Tab。不参与业务逻辑。
abstract class MainShellDebugHandle {
  /// 切换底部 Tab（0 首页 / 1 真人支持 / 2 测评 / 3 课程练习 / 4 我的）
  void selectTabForDebug(int index);
}

class _MainShellPageState extends ConsumerState<MainShellPage>
    implements MainShellDebugHandle {
  /// 当前 Tab：0 首页、1 真人支持、2 测评、3 课程练习、4 我的
  late int _currentIndex;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialTab.clamp(0, 4);
  }

  @override
  void didUpdateWidget(covariant MainShellPage oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.initialTab != widget.initialTab) {
      _currentIndex = widget.initialTab.clamp(0, 4);
    }
  }

  /// 联调驱动（阶段 IM 复验）：等价于点击底部 Tab。
  @override
  void selectTabForDebug(int index) {
    if (_currentIndex == index) return;
    setState(() => _currentIndex = index);
  }

  @override
  Widget build(BuildContext context) {
    // 消息未读总数（普通对话 + 系统通知；不含机器人；
    // iOS 参照：XYMessageViewModel.conversationUnreadTotal）
    final unreadCount = ref.watch(messageUnreadTotalProvider);
    return Scaffold(
      backgroundColor:
          _currentIndex == 0 ? const Color(0xFFF1F5F0) : Colors.transparent,
      extendBody: _currentIndex != 0,
      body: IndexedStack(
        index: _currentIndex,
        children: const [
          HomePage(),
          ConsultantTabPage(),
          AssessmentListPage(embedded: true),
          GrowthServicesPage(),
          MinePage(),
        ],
      ),
      bottomNavigationBar: AppTabBar(
        currentIndex: _currentIndex,
        unreadCount: unreadCount,
        compact: _currentIndex != 0,
        onTap: (index) => setState(() => _currentIndex = index),
      ),
    );
  }
}
