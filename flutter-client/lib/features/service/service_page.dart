import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/router/route_paths.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../home/home_models.dart';

class ServicePage extends StatelessWidget {
  const ServicePage({super.key});

  String _resource(String title, String type) =>
      '${RoutePaths.supportResource}?title=${Uri.encodeComponent(title)}'
      '&type=${Uri.encodeComponent(type)}';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F3),
      body: SafeArea(
        bottom: false,
        child: CustomScrollView(
          slivers: [
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(20, 14, 20, 120),
              sliver: SliverList.list(children: [
                const Text('服务',
                    style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF357169))),
                const SizedBox(height: 6),
                Text('从此刻开始，找到合适的支持',
                    style: AppTextStyles.displayLarge.copyWith(fontSize: 27)),
                const SizedBox(height: 7),
                const Text('说说最近发生的事，或用几个问题简单梳理一下。',
                    style:
                        TextStyle(height: 1.5, color: AppColors.textSecondary)),
                const SizedBox(height: 20),
                _ImmediateSupportCard(
                  onAiTap: () => context.push(RoutePaths.ai),
                  onGuideTap: () => context.push(RoutePaths.supportCheckIn),
                ),
                const SizedBox(height: 28),
                const _SectionHeading(eyebrow: '直接选择', title: '如果你已经知道自己想要什么'),
                const SizedBox(height: 12),
                Row(children: [
                  Expanded(
                    flex: 6,
                    child: _ProfessionalCard(
                      icon: Icons.people_alt_outlined,
                      title: '心理咨询',
                      description: '选择专业咨询师，建立持续的支持关系',
                      accent: const Color(0xFF286D64),
                      onTap: () => context.push(RoutePaths.supportConsultants),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    flex: 5,
                    child: _ProfessionalCard(
                      icon: Icons.headset_mic_outlined,
                      title: '真人倾听',
                      description: '此刻需要一个人认真听你说说',
                      accent: const Color(0xFF4F7894),
                      onTap: () => context.push(_resource('真人倾听', '即时支持')),
                    ),
                  ),
                ]),
                const SizedBox(height: 28),
                const _SectionHeading(eyebrow: '自主探索', title: '了解自己，也练习改变'),
                const SizedBox(height: 12),
                _ServiceRow(
                  icon: Icons.assignment_outlined,
                  color: const Color(0xFF4C78A8),
                  title: '心理测评',
                  subtitle: '从一个具体问题开始认识自己',
                  meta: '适合首次使用',
                  onTap: () => context.push(RoutePaths.assessmentList),
                ),
                _ServiceRow(
                  icon: Icons.spa_outlined,
                  color: const Color(0xFF3D8B78),
                  title: '心理练习',
                  subtitle: '把一次理解变成可以完成的小行动',
                  meta: '约 3–10 分钟',
                  onTap: () => context.push(RoutePaths.supportPractice),
                ),
                _ServiceRow(
                  icon: Icons.play_lesson_outlined,
                  color: const Color(0xFFB37A45),
                  title: '主题课程',
                  subtitle: '围绕关系、压力和成长持续学习',
                  meta: '可试看',
                  onTap: () => context.push(_resource('主题课程', '课程')),
                ),
                _ServiceRow(
                  icon: Icons.air_rounded,
                  color: const Color(0xFF5C8F94),
                  title: '放松与冥想',
                  subtitle: '呼吸、冥想、白噪音和睡眠引导',
                  meta: '现在就能开始',
                  onTap: () => context.push(RoutePaths.supportTools),
                ),
                const SizedBox(height: 28),
                const _SectionHeading(eyebrow: '按主题寻找', title: '从正在困扰你的事情出发'),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 9,
                  runSpacing: 9,
                  children: [
                    for (final topic in const [
                      ('焦虑与压力', Icons.waves_rounded),
                      ('睡眠困扰', Icons.bedtime_outlined),
                      ('亲密关系', Icons.favorite_border_rounded),
                      ('亲子沟通', Icons.family_restroom_rounded),
                      ('职场与成长', Icons.work_outline_rounded),
                      ('自我探索', Icons.explore_outlined),
                    ])
                      _TopicChip(
                        label: topic.$1,
                        icon: topic.$2,
                        onTap: () =>
                            context.push(_resource('${topic.$1}解决方案', '主题')),
                      ),
                  ],
                ),
                const SizedBox(height: 20),
                const Text(
                  '你可以自主选择服务。这里不会根据单一标签替你做诊断或强制推荐。',
                  style: TextStyle(
                      fontSize: 11, height: 1.6, color: AppColors.textTertiary),
                ),
              ]),
            ),
          ],
        ),
      ),
    );
  }
}

class _SectionHeading extends StatelessWidget {
  const _SectionHeading({required this.eyebrow, required this.title});
  final String eyebrow;
  final String title;
  @override
  Widget build(BuildContext context) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(eyebrow,
              style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF4C7E76))),
          const SizedBox(height: 3),
          Text(title, style: AppTextStyles.title.copyWith(fontSize: 19)),
        ],
      );
}

class _ImmediateSupportCard extends StatelessWidget {
  const _ImmediateSupportCard(
      {required this.onAiTap, required this.onGuideTap});
  final VoidCallback onAiTap;
  final VoidCallback onGuideTap;
  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.fromLTRB(18, 18, 14, 14),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF245F58), Color(0xFF3C8177)],
          ),
          borderRadius: BorderRadius.circular(25),
          boxShadow: const [
            BoxShadow(
                color: Color(0x33245F58), blurRadius: 22, offset: Offset(0, 9)),
          ],
        ),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Row(children: [
            Icon(Icons.auto_awesome_rounded,
                size: 18, color: Color(0xFFBDE6D9)),
            SizedBox(width: 7),
            Text('小鹿陪你一起理清',
                style: TextStyle(fontSize: 13, color: Color(0xFFD9EFE8))),
          ]),
          const SizedBox(height: 12),
          const Text('先从最近的一件事说起',
              style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w800,
                  color: Colors.white)),
          const SizedBox(height: 5),
          const Text('说出来，或者回答几个问题，下一步会更清楚。',
              style: TextStyle(
                  fontSize: 13, height: 1.5, color: Color(0xFFD9EFE8))),
          const SizedBox(height: 16),
          Row(children: [
            Expanded(
              child: FilledButton.icon(
                style: FilledButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: const Color(0xFF245F58),
                  minimumSize: const Size(0, 46),
                ),
                onPressed: onAiTap,
                icon: const Icon(Icons.chat_bubble_outline_rounded, size: 18),
                label: const Text('和小鹿聊聊'),
              ),
            ),
            const SizedBox(width: 9),
            Expanded(
              child: OutlinedButton(
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.white,
                  side: const BorderSide(color: Color(0x88FFFFFF)),
                  minimumSize: const Size(0, 46),
                ),
                onPressed: onGuideTap,
                child: const Text('快速梳理'),
              ),
            ),
          ]),
        ]),
      );
}

class _ProfessionalCard extends StatelessWidget {
  const _ProfessionalCard(
      {required this.icon,
      required this.title,
      required this.description,
      required this.accent,
      required this.onTap});
  final IconData icon;
  final String title;
  final String description;
  final Color accent;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) => Material(
        color: Colors.white,
        borderRadius: BorderRadius.circular(21),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(21),
          child: SizedBox(
            height: 164,
            child: Padding(
              padding: const EdgeInsets.all(15),
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 42,
                      height: 42,
                      decoration: BoxDecoration(
                          color: accent.withValues(alpha: .12),
                          borderRadius: BorderRadius.circular(14)),
                      child: Icon(icon, color: accent, size: 22),
                    ),
                    const Spacer(),
                    Text(title,
                        style: const TextStyle(
                            fontSize: 17, fontWeight: FontWeight.w700)),
                    const SizedBox(height: 5),
                    Text(description,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                            fontSize: 11,
                            height: 1.4,
                            color: AppColors.textSecondary)),
                  ]),
            ),
          ),
        ),
      );
}

class _ServiceRow extends StatelessWidget {
  const _ServiceRow(
      {required this.icon,
      required this.color,
      required this.title,
      required this.subtitle,
      required this.meta,
      required this.onTap});
  final IconData icon;
  final Color color;
  final String title;
  final String subtitle;
  final String meta;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.only(bottom: 10),
        child: Material(
          color: Colors.white,
          borderRadius: BorderRadius.circular(19),
          child: InkWell(
            onTap: onTap,
            borderRadius: BorderRadius.circular(19),
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Row(children: [
                Container(
                    width: 46,
                    height: 46,
                    decoration: BoxDecoration(
                        color: color.withValues(alpha: .12),
                        borderRadius: BorderRadius.circular(15)),
                    child: Icon(icon, color: color)),
                const SizedBox(width: 13),
                Expanded(
                    child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                      Row(children: [
                        Expanded(
                            child: Text(title,
                                style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w700))),
                        Text(meta,
                            style: const TextStyle(
                                fontSize: 10, color: AppColors.textTertiary))
                      ]),
                      const SizedBox(height: 4),
                      Text(subtitle,
                          style: const TextStyle(
                              fontSize: 12, color: AppColors.textSecondary)),
                    ])),
                const SizedBox(width: 5),
                const Icon(Icons.chevron_right_rounded,
                    color: AppColors.textTertiary),
              ]),
            ),
          ),
        ),
      );
}

class _TopicChip extends StatelessWidget {
  const _TopicChip(
      {required this.label, required this.icon, required this.onTap});
  final String label;
  final IconData icon;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) => ActionChip(
        onPressed: onTap,
        avatar: Icon(icon, size: 17, color: const Color(0xFF456C66)),
        label: Text(label),
        backgroundColor: Colors.white,
        side: const BorderSide(color: Color(0xFFDDE7E3)),
        padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 8),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      );
}

/// 全局「课程练习」Tab：用双页签区分系统学习与即时练习。
class GrowthServicesPage extends StatefulWidget {
  const GrowthServicesPage({super.key});

  @override
  State<GrowthServicesPage> createState() => _GrowthServicesPageState();
}

class _GrowthServicesPageState extends State<GrowthServicesPage> {
  int _tabIndex = 0;

  String _resource(String title, String type) =>
      '${RoutePaths.supportResource}?title=${Uri.encodeComponent(title)}'
      '&type=${Uri.encodeComponent(type)}';

  @override
  Widget build(BuildContext context) => Scaffold(
        backgroundColor: const Color(0xFFF1F5F3),
        body: SafeArea(
          bottom: false,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 18, 20, 14),
                child: Text('自主成长',
                    style: AppTextStyles.displayLarge.copyWith(fontSize: 27)),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: _GrowthSegmentedTabs(
                  selectedIndex: _tabIndex,
                  onChanged: (value) => setState(() => _tabIndex = value),
                ),
              ),
              const SizedBox(height: 14),
              Expanded(
                child: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 220),
                  child: _tabIndex == 0
                      ? _buildCourses(context)
                      : _buildPractices(context),
                ),
              ),
            ],
          ),
        ),
      );

  Widget _buildCourses(BuildContext context) => ListView(
        key: const ValueKey('courses'),
        padding: const EdgeInsets.fromLTRB(20, 4, 20, 120),
        children: [
          const Text('跟着专业内容，找到适合自己的解决思路。',
              style: TextStyle(height: 1.5, color: AppColors.textSecondary)),
          const SizedBox(height: 18),
          _FeaturedLearningCard(
            onTap: () => context.push(_resource('停止吼叫：父母情绪管理课', '视频课程')),
          ),
          const SizedBox(height: 26),
          const _SectionHeading(eyebrow: '家庭教育', title: '理解孩子，也照顾好自己'),
          const SizedBox(height: 12),
          _ServiceRow(
            icon: Icons.family_restroom_rounded,
            color: const Color(0xFFB2744E),
            title: '停止吼叫：父母情绪管理',
            subtitle: '看见失控背后的需要，减少亲子冲突',
            meta: '12 讲',
            onTap: () => context.push(_resource('停止吼叫：父母情绪管理', '视频课程')),
          ),
          _ServiceRow(
            icon: Icons.child_care_rounded,
            color: const Color(0xFF57867C),
            title: '孩子不配合，父母怎么沟通',
            subtitle: '从命令和对抗，走向清晰而温和的协商',
            meta: '8 讲',
            onTap: () => context.push(_resource('孩子不配合，父母怎么沟通', '视频课程')),
          ),
          const SizedBox(height: 18),
          const _SectionHeading(eyebrow: '亲密关系', title: '学习相处，而不是彼此消耗'),
          const SizedBox(height: 12),
          _ServiceRow(
            icon: Icons.favorite_border_rounded,
            color: const Color(0xFF9A6479),
            title: '关系中的表达与边界',
            subtitle: '说清自己的需要，也听懂对方的感受',
            meta: '10 讲',
            onTap: () => context.push(_resource('关系中的表达与边界', '视频课程')),
          ),
          _ServiceRow(
            icon: Icons.forum_outlined,
            color: const Color(0xFF6E7191),
            title: '冲突之后，如何重新靠近',
            subtitle: '识别关系循环，练习有效修复',
            meta: '7 讲',
            onTap: () => context.push(_resource('冲突之后，如何重新靠近', '视频课程')),
          ),
          const SizedBox(height: 18),
          const _SectionHeading(eyebrow: '自我成长', title: '更稳定地理解自己'),
          const SizedBox(height: 12),
          _ServiceRow(
            icon: Icons.record_voice_over_outlined,
            color: const Color(0xFFB37A45),
            title: '压力与情绪调节',
            subtitle: '认识压力反应，建立自己的调节方式',
            meta: '6 讲',
            onTap: () => context.push(_resource('压力与情绪调节', '视频课程')),
          ),
        ],
      );

  Widget _buildPractices(BuildContext context) => ListView(
        key: const ValueKey('practices'),
        padding: const EdgeInsets.fromLTRB(20, 4, 20, 120),
        children: [
          const Text('不用先想清楚，从一个当下能完成的小行动开始。',
              style: TextStyle(height: 1.5, color: AppColors.textSecondary)),
          const SizedBox(height: 18),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: const Color(0xFFDCEDE7),
              borderRadius: BorderRadius.circular(24),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.spa_outlined,
                    color: Color(0xFF286D64), size: 28),
                const SizedBox(height: 20),
                const Text('先做一个 3 分钟练习',
                    style:
                        TextStyle(fontSize: 21, fontWeight: FontWeight.w800)),
                const SizedBox(height: 6),
                const Text('呼吸、冥想和放松工具，现在就能开始。',
                    style: TextStyle(color: AppColors.textSecondary)),
                const SizedBox(height: 15),
                FilledButton(
                  onPressed: () => context.push(RoutePaths.supportTools),
                  child: const Text('选择小工具'),
                ),
              ],
            ),
          ),
          const SizedBox(height: 26),
          const _SectionHeading(eyebrow: '跟练计划', title: '用几天建立一种新习惯'),
          const SizedBox(height: 12),
          _ServiceRow(
            icon: Icons.nights_stay_outlined,
            color: const Color(0xFF596E9B),
            title: '睡眠改善练习',
            subtitle: '从睡前想法、呼吸和作息开始调整',
            meta: '7 天',
            onTap: () => context.push(_resource('睡眠改善练习', '练习')),
          ),
          _ServiceRow(
            icon: Icons.air_rounded,
            color: const Color(0xFF3D8B78),
            title: '焦虑缓解练习',
            subtitle: '识别身体信号，慢慢找回稳定感',
            meta: '5 天',
            onTap: () => context.push(_resource('焦虑缓解练习', '练习')),
          ),
          const SizedBox(height: 18),
          const _SectionHeading(eyebrow: '单次练习', title: '今天只完成一小步'),
          const SizedBox(height: 12),
          _ServiceRow(
            icon: Icons.edit_note_rounded,
            color: const Color(0xFF3D8B78),
            title: '自动想法记录',
            subtitle: '写下事件、感受和脑海中出现的判断',
            meta: '约 5 分钟',
            onTap: () => context.push(RoutePaths.supportPractice),
          ),
        ],
      );
}

class _GrowthSegmentedTabs extends StatelessWidget {
  const _GrowthSegmentedTabs({
    required this.selectedIndex,
    required this.onChanged,
  });

  final int selectedIndex;
  final ValueChanged<int> onChanged;

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.all(4),
        decoration: BoxDecoration(
          color: const Color(0xFFE4EAE7),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          children: [
            _item(0, Icons.play_circle_outline_rounded, '视频课程'),
            _item(1, Icons.self_improvement_rounded, '心理练习'),
          ],
        ),
      );

  Widget _item(int index, IconData icon, String label) {
    final selected = selectedIndex == index;
    return Expanded(
      child: InkWell(
        onTap: () => onChanged(index),
        borderRadius: BorderRadius.circular(13),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 180),
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: selected ? Colors.white : Colors.transparent,
            borderRadius: BorderRadius.circular(13),
            boxShadow: selected
                ? const [BoxShadow(color: Color(0x160F2E29), blurRadius: 12)]
                : null,
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon,
                  size: 20,
                  color: selected
                      ? const Color(0xFF28776D)
                      : AppColors.textSecondary),
              const SizedBox(width: 7),
              Text(label,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
                    color: selected
                        ? AppColors.textPrimary
                        : AppColors.textSecondary,
                  )),
            ],
          ),
        ),
      ),
    );
  }
}

class _FeaturedLearningCard extends StatelessWidget {
  const _FeaturedLearningCard({required this.onTap});
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => Material(
        color: const Color(0xFFF0E6DC),
        borderRadius: BorderRadius.circular(24),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('本周推荐 · 家庭教育',
                          style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF8A5B3D))),
                      const SizedBox(height: 10),
                      const Text('停止吼叫，从看懂自己的情绪开始',
                          style: TextStyle(
                              fontSize: 21,
                              height: 1.25,
                              fontWeight: FontWeight.w800)),
                      const SizedBox(height: 9),
                      const Text('12 讲视频课 · 可反复观看',
                          style: TextStyle(color: AppColors.textSecondary)),
                      const SizedBox(height: 18),
                      FilledButton.tonal(
                        onPressed: onTap,
                        child: const Text('查看课程'),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 14),
                Container(
                  width: 84,
                  height: 112,
                  decoration: BoxDecoration(
                    color: const Color(0xFFD8BFA7),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Icon(Icons.family_restroom_rounded,
                      size: 44, color: Color(0xFF7C4F35)),
                ),
              ],
            ),
          ),
        ),
      );
}

class SupportResourcePage extends StatelessWidget {
  const SupportResourcePage(
      {super.key, required this.title, required this.type});
  final String title;
  final String type;

  @override
  Widget build(BuildContext context) => Scaffold(
        backgroundColor: const Color(0xFFFAF8F4),
        appBar: AppBar(
            title: const Text('具体帮助'),
            backgroundColor: const Color(0xFFFAF8F4)),
        body: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            Text('Mock $type · 正式内容待审校',
                style: const TextStyle(
                    fontSize: 12, color: AppColors.textTertiary)),
            const SizedBox(height: 14),
            Text(title,
                style: AppTextStyles.displayLarge.copyWith(fontSize: 28)),
            const SizedBox(height: 18),
            const Text('先给这次沟通留一点空间', style: AppTextStyles.title),
            const SizedBox(height: 8),
            const Text('可以先确认双方都愿意谈，再说清这次想讨论的一件事。以下只用于演示页面结构，不是针对真实家庭的专业建议。',
                style: TextStyle(height: 1.8)),
            const SizedBox(height: 16),
            Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                    color: const Color(0xFFFFF3EA),
                    borderRadius: BorderRadius.circular(14)),
                child: const Text('“刚才我们都有点着急。我想等平静一点，再聊聊这件事。”',
                    style: TextStyle(height: 1.7))),
            const SizedBox(height: 24),
            FilledButton(
                onPressed: () => context.push(RoutePaths.supportPractice),
                child: const Text('陪我练一下')),
            OutlinedButton(
                onPressed: () => context.pop(), child: const Text('返回上一页')),
          ],
        ),
      );
}

class SupportPracticePage extends StatefulWidget {
  const SupportPracticePage({super.key});
  @override
  State<SupportPracticePage> createState() => _SupportPracticePageState();
}

class SupportCheckInPage extends StatefulWidget {
  const SupportCheckInPage({super.key});

  @override
  State<SupportCheckInPage> createState() => _SupportCheckInPageState();
}

class _SupportCheckInPageState extends State<SupportCheckInPage> {
  static const _questions = [
    ('此刻最占据你注意力的是？', ['一件具体的事', '一种说不清的情绪', '一段关系', '身体或睡眠']),
    ('它对你的影响更接近？', ['有点困扰', '反复想到', '已经影响生活', '暂时说不清']),
    ('你现在更希望获得什么？', ['先理清发生了什么', '理解自己的感受', '找到一个小行动', '考虑专业支持']),
  ];

  final List<String> _answers = [];
  int _index = 0;

  void _select(String answer) {
    setState(() {
      if (_answers.length > _index) {
        _answers[_index] = answer;
      } else {
        _answers.add(answer);
      }
      if (_index < _questions.length - 1) _index += 1;
    });
  }

  @override
  Widget build(BuildContext context) {
    final done = _answers.length == _questions.length;
    return Scaffold(
      backgroundColor: const Color(0xFFF4F6F2),
      appBar: AppBar(
        title: const Text('先梳理一下'),
        backgroundColor: const Color(0xFFF4F6F2),
      ),
      body: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 18, 20, 24),
          child: done ? _buildResult(context) : _buildQuestion(),
        ),
      ),
    );
  }

  Widget _buildQuestion() {
    final question = _questions[_index];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('${_index + 1} / ${_questions.length}',
            style: const TextStyle(color: AppColors.textTertiary)),
        const SizedBox(height: 10),
        LinearProgressIndicator(
          value: (_index + 1) / _questions.length,
          minHeight: 5,
          borderRadius: BorderRadius.circular(99),
          color: const Color(0xFF2F7B70),
          backgroundColor: const Color(0xFFDDE8E3),
        ),
        const SizedBox(height: 30),
        Text(question.$1,
            style: AppTextStyles.displayLarge.copyWith(fontSize: 25)),
        const SizedBox(height: 10),
        const Text('没有标准答案，选最接近你此刻感受的一项。',
            style: TextStyle(color: AppColors.textSecondary)),
        const SizedBox(height: 24),
        for (final option in question.$2)
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Material(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
              child: InkWell(
                onTap: () => _select(option),
                borderRadius: BorderRadius.circular(18),
                child: Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 18, vertical: 18),
                  child: Row(children: [
                    Expanded(
                        child: Text(option,
                            style: const TextStyle(
                                fontSize: 16, fontWeight: FontWeight.w600))),
                    const Icon(Icons.chevron_right,
                        color: AppColors.textTertiary),
                  ]),
                ),
              ),
            ),
          ),
        const Spacer(),
        if (_index > 0)
          TextButton.icon(
            onPressed: () => setState(() => _index -= 1),
            icon: const Icon(Icons.arrow_back),
            label: const Text('上一题'),
          ),
      ],
    );
  }

  Widget _buildResult(BuildContext context) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: const BoxDecoration(
                color: Color(0xFFDCEDE7), shape: BoxShape.circle),
            child: const Icon(Icons.check_rounded, color: Color(0xFF2F7B70)),
          ),
          const SizedBox(height: 22),
          Text('已经有一点头绪了',
              style: AppTextStyles.displayLarge.copyWith(fontSize: 27)),
          const SizedBox(height: 12),
          const Text('这不是诊断，只是帮你把此刻最需要关注的部分放到眼前。',
              style: TextStyle(height: 1.6, color: AppColors.textSecondary)),
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
                color: Colors.white, borderRadius: BorderRadius.circular(20)),
            child: Column(
              children: [
                for (var i = 0; i < _answers.length; i++) ...[
                  Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text('0${i + 1}',
                        style: const TextStyle(color: Color(0xFF2F7B70))),
                    const SizedBox(width: 14),
                    Expanded(child: Text(_answers[i])),
                  ]),
                  if (i != _answers.length - 1) const Divider(height: 28),
                ],
              ],
            ),
          ),
          const Spacer(),
          SizedBox(
            width: double.infinity,
            child: FilledButton(
              onPressed: () => context.pop(),
              child: const Text('完成梳理'),
            ),
          ),
        ],
      );
}

class SupportToolsPage extends StatelessWidget {
  const SupportToolsPage({super.key});

  static const _descriptions = [
    '跟随节奏慢慢呼吸',
    '用声音留出安静空间',
    '重复动作帮助转移注意',
    '短暂回到身体和当下',
    '睡前跟随语音放松',
    '轻轻点掉此刻的烦乱'
  ];

  @override
  Widget build(BuildContext context) => Scaffold(
        backgroundColor: const Color(0xFFF4F6F2),
        appBar: AppBar(
          title: const Text('先缓一缓'),
          backgroundColor: const Color(0xFFF4F6F2),
        ),
        body: ListView(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 28),
          children: [
            Text('选一个现在用得上的小工具',
                style: AppTextStyles.displayLarge.copyWith(fontSize: 25)),
            const SizedBox(height: 8),
            const Text('不用完成任务，哪怕只停留一分钟也可以。',
                style: TextStyle(color: AppColors.textSecondary)),
            const SizedBox(height: 22),
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: kHomeTools.length,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 1.08,
              ),
              itemBuilder: (context, index) {
                final tool = kHomeTools[index];
                return Material(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  child: InkWell(
                    borderRadius: BorderRadius.circular(20),
                    onTap: () => context.push(
                      '${RoutePaths.webview}?url=${Uri.encodeComponent(tool.linkUrl)}&title=${Uri.encodeComponent(tool.title)}',
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            width: 44,
                            height: 44,
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: const Color(0xFFE7F1ED),
                              borderRadius: BorderRadius.circular(14),
                            ),
                            child: Image.asset(tool.iconAsset),
                          ),
                          const Spacer(),
                          Text(tool.title,
                              style: const TextStyle(
                                  fontSize: 16, fontWeight: FontWeight.w700)),
                          const SizedBox(height: 4),
                          Text(_descriptions[index],
                              style: const TextStyle(
                                  fontSize: 11, color: AppColors.textTertiary)),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      );
}

class _SupportPracticePageState extends State<SupportPracticePage> {
  final _controller =
      TextEditingController(text: '我想和你聊聊刚才发生的事。我们都平静一点后，再一起看看怎么安排。');
  bool _saved = false;
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
        backgroundColor: const Color(0xFFFAF8F4),
        appBar: AppBar(
            title: const Text('沟通练习 · AI'),
            backgroundColor: const Color(0xFFFAF8F4)),
        body: ListView(padding: const EdgeInsets.all(20), children: [
          Text('练一句不容易说出口的话',
              style: AppTextStyles.displayLarge.copyWith(fontSize: 27)),
          const SizedBox(height: 12),
          const Text('我只帮你把表达变得更具体，不预测对方真实反应。',
              style: TextStyle(height: 1.7, color: AppColors.textSecondary)),
          const SizedBox(height: 18),
          TextField(
              controller: _controller,
              minLines: 5,
              maxLines: 8,
              decoration: const InputDecoration(
                  labelText: '我的表达草稿', border: OutlineInputBorder())),
          const SizedBox(height: 16),
          FilledButton(
              onPressed: () => setState(() => _saved = true),
              child: Text(_saved ? '已保存到本机 Mock 记录' : '保存这份练习稿')),
          OutlinedButton(
              onPressed: () => context.pop(), child: const Text('退出练习')),
        ]),
      );
}
