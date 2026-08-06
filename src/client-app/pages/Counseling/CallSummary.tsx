import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppStore } from "../../store";
import {
  Star,
  FileText,
  CheckCircle2,
  Copy,
  Send,
  Sparkles,
  ChevronRight,
  User,
} from "lucide-react";
import { mockCounselors } from "../../data";

export function CallSummary() {
  const { resetToView, popView, bookingOrder, selectedCounselorOrder, selectedCounselorId } = useAppStore();
  
  // 区分是咨询师端还是用户端
  const isCounselorView = !!selectedCounselorOrder;
  const order = isCounselorView ? selectedCounselorOrder : bookingOrder;

  const counselor =
    mockCounselors.find(
      (c) => c.id === (order?.counselorId || selectedCounselorId),
    ) || mockCounselors[0];

  const [rating, setRating] = useState(0);
  const [hoveredA, setHoveredA] = useState(0);
  const [feedback, setFeedback] = useState("");
  
  // 咨询师端专属状态
  const [counselorAdvice, setCounselorAdvice] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  
  const [submitted, setSubmitted] = useState(false);
  const [addedToPlan, setAddedToPlan] = useState(false);

  // Mock Tasks generated from session
  const tasks = [
    { text: "睡前尝试 5 分钟的躯体扫描静观", done: false },
    { text: "当恐慌感袭来时，进行 4-7-8 呼吸法", done: false },
  ];

  const handleSubmitEvaluation = () => {
    setSubmitted(true);
    // Submit API simulation
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="flex flex-col h-full bg-surface absolute inset-0 z-50 overflow-hidden"
    >
      <div className="pt-14 pb-4 px-4 bg-white sticky top-0 z-10 flex items-center border-b border-gray-50 shadow-sm">
        <h1 className="text-[17px] font-bold flex-1 text-center text-gray-900">
          咨询记录与总结
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        <div className="p-4 space-y-4">
          
          {/* 用户端：评价模块 */}
          {!isCounselorView && (
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center relative overflow-hidden">
              {!submitted ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key="eval"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center w-full"
                  >
                    <img
                      src={counselor.avatar}
                      alt={counselor.name}
                      className="w-16 h-16 rounded-full border-2 border-gray-100 mb-3"
                    />
                    <h2 className="text-lg font-bold text-gray-900 mb-1">
                      本次咨询结束
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                      您的评价会帮助 {counselor.name} 提供更好的服务
                    </p>

                    <div className="flex space-x-2 mb-6">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <button
                          key={i}
                          onMouseEnter={() => setHoveredA(i)}
                          onMouseLeave={() => setHoveredA(0)}
                          onClick={() => setRating(i)}
                          className="active:scale-95 transition-transform"
                        >
                          <Star
                            size={36}
                            className={`transition-colors ${
                              (hoveredA || rating) >= i
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-200 fill-gray-200"
                            }`}
                          />
                        </button>
                      ))}
                    </div>

                    <div className="w-full relative">
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="可以写下你的感受匿名反馈给咨询师..."
                        className="w-full bg-surface text-sm p-4 rounded-xl resize-none outline-none focus:border-primary/50 border border-transparent transition-colors mb-4"
                        rows={3}
                      />
                    </div>

                    <button
                      onClick={handleSubmitEvaluation}
                      disabled={!rating}
                      className={`w-full py-3.5 rounded-full font-bold transition-colors ${rating ? "bg-primary text-white active:bg-primary-dark" : "bg-gray-100 text-gray-400"}`}
                    >
                      提交评价
                    </button>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <motion.div
                  key="thanks"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-6"
                >
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-500">
                    <CheckCircle2 size={32} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">
                    感谢评价
                  </h2>
                  <p className="text-sm text-gray-500">
                    我们已经记录下你的宝贵意见
                  </p>
                </motion.div>
              )}
            </div>
          )}

          {/* 小鹿 Generated Notes (双方可见，文案稍有不同) */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <h2 className="font-bold text-[16px] text-gray-900 mb-4 flex items-center">
              <Sparkles size={20} className="mr-2 text-primary" /> 
              {isCounselorView ? "小鹿预整理咨询纪要" : "小鹿整理的咨询纪要"}
            </h2>
            <div className="space-y-4 text-[14px] text-gray-700 leading-loose tracking-wide">
              <div className="bg-primary/5 p-4 rounded-2xl">
                <span className="text-sm font-bold text-primary block mb-1">
                  本次核心探讨：
                </span>
                探讨了对于即将到来的期末考试产生的弥散性焦虑情绪，以及在学习小组中因害怕拒绝别人请求而导致的精力耗竭。
              </div>
              {!isCounselorView && (
                <div className="p-4 bg-surface rounded-2xl border border-gray-50">
                  <span className="text-sm font-bold text-gray-900 block mb-1">
                    咨询师赠言：
                  </span>
                  “讨好别人并不能买来真正的友谊。我们需要先稳住自己的内核，学会温和但坚定地说‘不’。情绪没有好坏之分，给自己一些接纳和喘息的空间。”
                </div>
              )}
            </div>
          </div>

          {/* 用户端：行动建议与计划 */}
          {!isCounselorView && (
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
              <h2 className="font-bold text-[16px] text-gray-900 mb-4 flex items-center">
                <CheckCircle2 size={20} className="mr-2 text-gray-900" />{" "}
                本周课后行动建议
              </h2>
              <div className="space-y-3">
                {tasks.map((task, i) => (
                  <div
                    key={i}
                    className="flex items-start space-x-3 p-3 bg-surface rounded-xl border border-gray-100"
                  >
                    <div className="mt-0.5 w-4 h-4 rounded-full border border-primary shrink-0 bg-white"></div>
                    <span className="text-sm text-gray-700 leading-snug">
                      {task.text}
                    </span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setAddedToPlan(true)}
                disabled={addedToPlan}
                className={`w-full mt-4 py-3 border rounded-xl text-[13px] font-medium transition-colors flex justify-center items-center ${addedToPlan ? 'bg-gray-50 border-gray-100 text-gray-400' : 'border-gray-200 bg-white text-gray-600 active:bg-gray-50'}`}
              >
                {addedToPlan ? '已加入行动计划' : '加入行动计划'}
              </button>
            </div>
          )}

          {/* 咨询师端：输入给用户的建议与定性总结 */}
          {isCounselorView && (
            <>
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                <h2 className="font-bold text-[16px] text-gray-900 mb-2">给用户的建议/行动计划</h2>
                <p className="text-[12px] text-gray-400 mb-4">这些内容将会展示在用户的咨询纪要中</p>
                <textarea
                  value={counselorAdvice}
                  onChange={(e) => setCounselorAdvice(e.target.value)}
                  placeholder="例如：建议尝试每天睡前进行 5 分钟的呼吸放松练习..."
                  className="w-full bg-surface text-sm p-4 rounded-xl resize-none outline-none focus:border-primary/50 border border-transparent transition-colors"
                  rows={4}
                />
              </div>

              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                <h2 className="font-bold text-[16px] text-gray-900 mb-2">定性总结（内部记录）</h2>
                <p className="text-[12px] text-gray-400 mb-4">仅自己和督导可见，不对用户展示</p>
                <textarea
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="记录本次咨询的核心难点、用户表现及后续跟进方向..."
                  className="w-full bg-orange-50/50 text-sm p-4 rounded-xl resize-none outline-none focus:border-orange-200 border border-transparent transition-colors placeholder:text-orange-300"
                  rows={4}
                />
              </div>
            </>
          )}

        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-20">
        <button
          onClick={() => {
            if (isCounselorView) {
              resetToView("counselor-workbench");
            } else {
              // 返回到历史咨询记录或者首页
              popView();
            }
          }}
          className="w-full bg-gray-900 text-white font-bold py-4 rounded-full active:bg-gray-800 transition-colors shadow-md shadow-gray-900/20 text-[15px]"
        >
          {isCounselorView ? "保存并结束服务" : "完成并关闭"}
        </button>
      </div>
    </motion.div>
  );
}
