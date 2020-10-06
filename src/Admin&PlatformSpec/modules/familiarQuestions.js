import { QuestionsModel } from "../models/familiarQuestions";

let QuestionModule = {
  async addQuestion(question) {
    return await QuestionsModel({ ...question }).save();
  },
  async getQuestions(type,lang="ar") {
    let queryOp={}
    queryOp.lang=lang;
    if(type)queryOp.type=type;
    return await QuestionsModel.find({...queryOp});
  },
};
export { QuestionModule };
