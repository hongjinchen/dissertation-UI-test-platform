# 实现

## React Calendar Heatmap

https://www.npmjs.com/package/react-calendar-heatmap?activeTab=readme

```
<CalendarHeatmap
  startDate={new Date('2022-01-01')}
  endDate={new Date('2022-12-31')}
  values={userContributions}
  // ...
/>
```



# **数据结构**

## To do list

```
const taskLists = [
  {
    id: 1,
    name: 'List 1',
    tasks: [
      { id: 1, name: 'Task 1' },
      { id: 2, name: 'Task 2' },
    ],
  },
  {
    id: 2,
    name: 'List 2',
    tasks: [
      { id: 3, name: 'Task 3' },
      { id: 4, name: 'Task 4' },
    ],
  },
];

```



## Calendar Heatmap

```
const userContributions = [
  { date: '2022-01-01', count: 12 },
  { date: '2022-01-02', count: 5 },
  { date: '2022-01-03', count: 8 },
  { date: '2022-01-04', count: 0 },
];
```



