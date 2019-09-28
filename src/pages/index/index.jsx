import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import './index.less'
import AddQuestion from './addquestion'

//利用缓存
function getStore(key) {
  let str = Taro.getStorageSync(key);
  if (!str) {return []}
  return JSON.parse(str);
}
function setStore(key, obj) {
  let str = obj;
  if (typeof obj=='object') {
    str = JSON.stringify(obj)
  }
  Taro.setStorageSync(key,str)
}
export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }
  state = {
    showQuestion: false, // 显示浮层
    questionList: getStore('questions')
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  addQuestion() {
    this.setState({
      showQuestion: true
    })
  }
  closeQuestion() {
    this.setState({
      showQuestion: false
    })
  }
  revriveQuestion(options) {
    let {questionList} = this.state;
    questionList.push({id:parseInt(Math.random()*10000), ...options})
    this.setState({
      questionList
    },()=>{
      // console.log(this.state.questionList)
      setStore('questions',this.state.questionList)
    })
    // 更新完会关闭窗口
    this.closeQuestion();
  }
  //投票
  addVote(item) {
    let {questionList} = this.state;
    if(item){
      item.vote = item.vote?(item.vote+1):1
    }
    let newList = questionList.map(itemQuestion=>{
      if(itemQuestion.id==item.id){
        itemQuestion={...item};
      }
      return itemQuestion
    })
    //改变之后重新赋值，并且将缓存也更新
    this.setState({
      questionList:newList
    },()=>{
      setStore('questions',this.state.questionList)
    })
  }
  cutVote(item) {
    let {questionList} = this.state;
    if(item){
      item.vote = item.vote?((item.vote-1)>=0?(item.vote-1):0):0
    }
    let newList = questionList.map(itemQuestion=>{
      if(itemQuestion.id==item.id){
        itemQuestion={...item};
      }
      return itemQuestion
    })
    //改变之后重新赋值，并且将缓存也更新
    this.setState({
      questionList:newList
    },()=>{
      setStore('questions',this.state.questionList)
    })
  }
  render() {
    let {questionList} = this.state;
    questionList.sort((a,b)=>b.vote-a.vote)
    return (
      <View className='index'>
        <View className='title'>话题模块</View>
        <View className='question-list'>
          {
            questionList.map((item,index)=>{
              return (
                <View key={index} className='question'>
                  <View className='question-left'>
                    <View className='question-title'>{item.title}</View>
                    <View className='question-des'>{item.des}</View>
                  </View>
                  <View className='question-right'>
                    <View onClick={this.addVote.bind(this,item)} className='img top' />
                    <Text>{item.vote?item.vote:0}</Text>
                    <View onClick={this.cutVote.bind(this,item)}className='img bottom' />
                  </View>
                </View>
              )
            })
          }
        </View>
        {
          this.state.showQuestion ? <AddQuestion onRevriveQuestion={this.revriveQuestion.bind(this)} onCloseQuestion={this.closeQuestion.bind(this)}/>: null
        }
        <Button onClick={this.addQuestion.bind(this)} className='btn-questions'>提问</Button>
      </View>
    )
  }
}
