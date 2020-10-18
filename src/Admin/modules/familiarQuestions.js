import { QuestionsModel } from "../models/familiarQuestions";

let QuestionModule = {
  async addQuestion(question) {
    return await QuestionsModel.insertMany([
      {
        question: question.questionAr,
        answer: question.answerAr,
        type: question.type,
        lang: "ar",
      },
      {
        question: question.questionEn,
        answer: question.answerEn,
        type: question.type,
        lang: "en",
      },
    ]);
  },
  async getQuestions(type, lang = "ar") {
    let queryOp = {};
    queryOp.lang = lang;
    if (type) queryOp.type = type;
    return await QuestionsModel.find({ ...queryOp });
  },
};
export { QuestionModule };
