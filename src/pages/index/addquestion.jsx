import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, Textarea, Button } from '@tarojs/components'
import Dialog from './dialog'
import './addquestion.less'
export default class AddQuestion extends Component {
  btnCancel() {
    // 调用上层组件的方法
    this.props.onCloseQuestion&&this.props.onCloseQuestion()
  }
  btnOk() {
    // 点击确定 采集数据 关闭额窗口传递数据
    if (this.state.title&&this.state.des){
      this.props.onRevriveQuestion(this.state)
    } else {
      Taro.showModal({
        title: '请输入标题或内容'
      })
    }
  }
  changeTitle(e) {
    this.setState({
      title:e.target.value
    })
  }
  changeDes(e) {
    this.setState({
      des:e.target.value
    })
  }
  render() {
    return (
      <Dialog>
        <View className='add-question'>
          <View className='question-body'>
            <Input onChange={this.changeTitle.bind(this)} className='question-title' placeholder='请输入问题'/>
            <Textarea  onInput={this.changeDes.bind(this)} className='question-des' placeholder='请输入问题描述'/>
            <View className='btn-group'>
              <Button onClick={this.btnOk.bind(this)} className='btn-question ok'>确定</Button>
              <Button onClick={this.btnCancel.bind(this)} className='btn-question cancel'>取消</Button>
            </View>
          </View>
        </View>
      </Dialog>
    )
  }
}
