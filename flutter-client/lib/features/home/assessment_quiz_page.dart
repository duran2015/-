import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/router/route_paths.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_dimens.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/widgets/app_background.dart';
import '../../core/widgets/app_nav_bar.dart';

/// 测评答题页（路由 /assessment/quiz）。
///
/// mock 预览模式的原生答题容器：介绍页「开始测试」进入，
/// 逐题作答（点选自动跳下一题），答完后替换栈进结果预览页
/// （/assessment/result-teaser），保证「介绍 → 答题 → 支付 →
/// 完整解读」链路完整可走。真实环境仍由答题 H5（webview）承担。
///
/// 题目内容：GAD-7 使用真实 7 题；其余量表用通用筛查条目池，
/// 题量取 min(questionCount, 20)，仅用于演示流程。
class AssessmentQuizPage extends StatefulWidget {
  const AssessmentQuizPage({
    super.key,
    required this.questionnaireId,
    this.questionnaireKey = '',
    required this.title,
    this.priceText = '',
    this.questionCount = 0,
    this.userAssessId,
  });

  final int questionnaireId;
  final String questionnaireKey;
  final String title;
  final String priceText;
  final int questionCount;
  final int? userAssessId;

  @override
  State<AssessmentQuizPage> createState() => _AssessmentQuizPageState();
}

class _AssessmentQuizPageState extends State<AssessmentQuizPage> {
  int _index = 0;
  final List<int> _answers = [];

  /// GAD-7 真实条目（过去两周的困扰频率）。
  static const _gad7Questions = [
    '感到紧张、焦虑或急躁',
    '无法停止或控制担忧',
    '对各种各样的事情过度担忧',
    '很难放松下来',
    '坐立不安，以至于难以安静地坐着',
    '变得容易烦恼或易怒',
    '感到害怕，好像有什么可怕的事情要发生',
  ];

  /// 通用筛查条目池（其他量表演示用）。
  static const _genericQuestions = [
    '我感到情绪低沉，提不起劲',
    '我对平时喜欢的事情失去了兴趣',
    '我入睡困难，或睡得不安稳',
    '我感到疲惫，精力不足',
    '我胃口不好，或吃得比平时多',
    '我觉得自己不够好，或让家人失望',
    '我难以集中注意力做事情',
    '我说话或行动比平时迟缓，或相反地烦躁多动',
    '我心里总觉得有事情要发生，放心不下',
    '我容易因为小事发脾气',
    '我会没来由地感到心慌或出汗',
    '我很难做决定，总是反复纠结',
    '我觉得未来没有什么希望',
    '我宁愿一个人待着，不想见人',
    '我的身体常有说不清的不舒服',
    '我反复回想一些不愉快的事',
    '我担心别人对我的看法',
    '我觉得自己的生活缺乏掌控感',
    '我很难从放松中获得愉快',
    '整体上，我能照顾好自己并应对压力',
  ];

  static const _gad7Options = ['完全不会', '几天', '一半以上的天数', '几乎每天'];
  static const _genericOptions = ['没有', '偶尔', '经常', '持续如此'];

  late final List<String> _questions = _buildQuestions();

  List<String> _buildQuestions() {
    if (widget.questionnaireKey == 'gad7') return _gad7Questions;
    final count = widget.questionCount <= 0
        ? 10
        : widget.questionCount > _genericQuestions.length
            ? _genericQuestions.length
            : widget.questionCount;
    return _genericQuestions.sublist(0, count);
  }

  List<String> get _options =>
      widget.questionnaireKey == 'gad7' ? _gad7Options : _genericOptions;

  String get _prompt => widget.questionnaireKey == 'gad7'
      ? '过去两周，以下情况困扰你的频率？'
      : '最近两周，你的状态更接近？';

  bool get _isLast => _index == _questions.length - 1;

  void _select(int optionIndex) {
    if (_answers.length > _index) {
      _answers[_index] = optionIndex;
    } else {
      _answers.add(optionIndex);
    }
    if (_isLast) {
      _submit();
      return;
    }
    // 短暂停顿让用户感知选中，再自动进入下一题
    Future<void>.delayed(const Duration(milliseconds: 180), () {
      if (!mounted) return;
      setState(() => _index += 1);
    });
  }

  void _prev() {
    if (_index > 0) setState(() => _index -= 1);
  }

  /// 答完：替换栈进结果预览页（避免返回键回到答题页）。
  void _submit() {
    context.pushReplacement(
      Uri(path: RoutePaths.assessmentResultTeaser, queryParameters: {
        'questionnaireId': '${widget.questionnaireId}',
        'title': widget.title,
        if (widget.userAssessId != null)
          'userAssessId': '${widget.userAssessId}',
        'priceText': widget.priceText,
      }).toString(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final total = _questions.length;
    final progress = (_index + 1) / total;
    final selected = _answers.length > _index ? _answers[_index] : -1;

    return Scaffold(
      body: AppPageBackground(
        child: SafeArea(
          child: Column(
            children: [
              AppNavBar(title: widget.title, transparent: true),
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 4, 20, 0),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          '第 ${_index + 1} / $total 题',
                          style: AppTextStyles.body.copyWith(
                            color: AppColors.textSecondary,
                          ),
                        ),
                        if (_index > 0)
                          GestureDetector(
                            onTap: _prev,
                            child: Text(
                              '上一题',
                              style: AppTextStyles.body.copyWith(
                                color: AppColors.brandTeal,
                              ),
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(4),
                      child: LinearProgressIndicator(
                        value: progress,
                        minHeight: 6,
                        backgroundColor: const Color(0xFFE2EAE6),
                        valueColor: const AlwaysStoppedAnimation<Color>(
                            AppColors.brandTeal),
                      ),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.fromLTRB(20, 24, 20, 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _prompt,
                        style: AppTextStyles.body.copyWith(
                          color: AppColors.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        _questions[_index],
                        style: AppTextStyles.titleXLarge.copyWith(height: 1.5),
                      ),
                      const SizedBox(height: 28),
                      for (var i = 0; i < _options.length; i++) ...[
                        _optionTile(i, _options[i], selected == i),
                        const SizedBox(height: 12),
                      ],
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

  Widget _optionTile(int index, String text, bool selected) {
    return GestureDetector(
      onTap: () => _select(index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
        decoration: BoxDecoration(
          color: selected
              ? AppColors.brandTeal.withValues(alpha: 0.10)
              : AppColors.cardBackground,
          borderRadius: BorderRadius.circular(AppDimens.cardRadiusLarge),
          border: Border.all(
            color:
                selected ? AppColors.brandTeal : const Color(0xFFE2EAE6),
            width: selected ? 1.6 : 1,
          ),
        ),
        child: Row(
          children: [
            Expanded(
              child: Text(
                text,
                style: AppTextStyles.titleSmall.copyWith(
                  color: selected
                      ? AppColors.brandTeal
                      : AppColors.textPrimary,
                ),
              ),
            ),
            Icon(
              selected
                  ? Icons.check_circle_rounded
                  : Icons.circle_outlined,
              size: 20,
              color: selected
                  ? AppColors.brandTeal
                  : const Color(0xFFB8C6C0),
            ),
          ],
        ),
      ),
    );
  }
}
