import { View, Text } from '@tarojs/components'
import React, { useState, useEffect, useCallback } from 'react'
import './index.scss'

// 定义日期类型
interface DateItem {
  day: number
  date: string // YYYY-MM-DD
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  isInRange: boolean
  isStart: boolean
  isEnd: boolean
}

// 组件属性
interface CalendarProps {
  visible: boolean
  onClose: () => void
  onConfirm: (startDate: string, endDate: string) => void
  defaultStartDate?: string
  defaultEndDate?: string
}

// 工具函数：格式化日期为 YYYY-MM-DD（彻底解决时区问题）
const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const Calendar: React.FC<CalendarProps> = ({
  visible,
  onClose,
  onConfirm,
  defaultStartDate,
  defaultEndDate
}) => {
  // 当前年月
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
  // 选中的日期（核心：用useState确保状态更新触发重渲染）
  const [startDate, setStartDate] = useState<string>(defaultStartDate || '')
  const [endDate, setEndDate] = useState<string>(defaultEndDate || '')
  // 日历数据
  const [calendarData, setCalendarData] = useState<DateItem[]>([])

  // 核心：生成日历数据（抽成独立函数，确保可重复调用）
  const generateCalendar = useCallback((year: number, month: number) => {
    const result: DateItem[] = []
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)
    const firstDayWeek = firstDay.getDay() === 0 ? 7 : firstDay.getDay()
    const daysInMonth = lastDay.getDate()
    const today = formatDate(new Date())

    // 补上个月的尾巴
    const prevMonthLastDay = new Date(year, month - 1, 0).getDate()
    for (let i = firstDayWeek - 1; i > 0; i--) {
      const day = prevMonthLastDay - i + 1
      const date = formatDate(new Date(year, month - 2, day))
      result.push({
        day,
        date,
        isCurrentMonth: false,
        isToday: date === today,
        isSelected: false,
        isInRange: false,
        isStart: false,
        isEnd: false
      })
    }

    // 当月的日期（核心：每次生成都重新计算选中状态）
    for (let i = 1; i <= daysInMonth; i++) {
      const date = formatDate(new Date(year, month - 1, i))
      // 实时判断选中状态（关键：用最新的startDate/endDate）
      const isStart = date === startDate
      const isEnd = date === endDate
      const isSelected = isStart || isEnd
      
      // 区间判断
      let isInRange = false
      if (startDate && endDate) {
        const start = new Date(startDate).getTime()
        const end = new Date(endDate).getTime()
        const current = new Date(date).getTime()
        isInRange = current > start && current < end
      }

      result.push({
        day: i,
        date,
        isCurrentMonth: true,
        isToday: date === today,
        isSelected,
        isInRange,
        isStart,
        isEnd
      })
    }

    // 补下个月的开头
    const totalCells = 42
    const needPad = totalCells - result.length
    for (let i = 1; i <= needPad; i++) {
      const date = formatDate(new Date(year, month, i))
      result.push({
        day: i,
        date,
        isCurrentMonth: false,
        isToday: date === today,
        isSelected: false,
        isInRange: false,
        isStart: false,
        isEnd: false
      })
    }

    setCalendarData(result)
  }, [startDate, endDate]) // 依赖：startDate/endDate变化就重新生成

  // 初始化+年月变化+选中日期变化 都重新生成日历
  useEffect(() => {
    generateCalendar(currentYear, currentMonth)
  }, [currentYear, currentMonth, generateCalendar])

  // 切换月份
  const changeMonth = (type: 'prev' | 'next') => {
    if (type === 'prev') {
      currentMonth === 1 
        ? (setCurrentYear(currentYear - 1), setCurrentMonth(12))
        : setCurrentMonth(currentMonth - 1)
    } else {
      currentMonth === 12 
        ? (setCurrentYear(currentYear + 1), setCurrentMonth(1))
        : setCurrentMonth(currentMonth + 1)
    }
  }

  // 核心修复：选择日期（即时更新状态+重新生成日历）
  const selectDate = (date: string) => {
    // 过滤非当月/过去的日期
    const targetItem = calendarData.find(item => item.date === date)
    if (!targetItem?.isCurrentMonth) return
    
    const today = formatDate(new Date())
    if (date < today) return

    // 选择逻辑（即时更新状态）
    if (!startDate) {
      // 第一次选择：设置入住日期
      setStartDate(date)
    } else if (!endDate) {
      // 第二次选择：设置离店日期（必须晚于入住）
      const start = new Date(startDate).getTime()
      const current = new Date(date).getTime()
      if (current > start) {
        setEndDate(date)
      }
    } else {
      // 重新选择：清空离店，重置入住
      setStartDate(date)
      setEndDate('')
    }

    // 强制触发日历重新生成（确保样式即时更新）
    generateCalendar(currentYear, currentMonth)
  }

  // 确认选择
  const handleConfirm = () => {
    if (startDate && endDate) {
      onConfirm(startDate, endDate)
      onClose()
    }
  }

  if (!visible) return null

  return (
    <View className="calendar-mask">
      <View className="calendar-container">
        {/* 日历头部 */}
        <View className="calendar-header">
          <Text className="header-title">{currentYear}年{currentMonth}月</Text>
          <View className="header-actions">
            <Text className="action-btn" onClick={() => changeMonth('prev')}>上月</Text>
            <Text className="action-btn" onClick={() => changeMonth('next')}>下月</Text>
          </View>
        </View>

        {/* 星期标题 */}
        <View className="calendar-week">
          {['一', '二', '三', '四', '五', '六', '日'].map((item) => (
            <Text key={item} className="week-item">{item}</Text>
          ))}
        </View>

        {/* 日历主体（确保样式类正确） */}
        <View className="calendar-body">
          {calendarData.map((item, index) => {
            const baseClass = 'calendar-item'
            const modifiers = [
              item.isCurrentMonth ? '' : 'not-current',
              item.isToday ? 'today' : '',
              item.isSelected ? 'selected' : '',
              item.isInRange ? 'in-range' : '',
              item.isStart ? 'start' : '',
              item.isEnd ? 'end' : ''
            ].filter(Boolean).join(' ')

            return (
              <View
                key={index}
                className={`${baseClass} ${modifiers}`}
                onClick={() => selectDate(item.date)}
                // 增加点击反馈（可选）
                hoverClass="calendar-item-hover"
              >
                <Text className="day-text">{item.day}</Text>
              </View>
            )
          })}
        </View>

        {/* 底部操作栏 */}
        <View className="calendar-footer">
          <Text className="cancel-btn" onClick={onClose}>取消</Text>
          <Text 
            className={`confirm-btn ${!startDate || !endDate ? 'disabled' : ''}`}
            onClick={handleConfirm}
          >
            确认
          </Text>
        </View>
      </View>
    </View>
  )
}

export default Calendar