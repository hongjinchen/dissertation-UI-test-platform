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





# 表

使用关系型数据库

表:["user","team","kanban_task_lists","kanban_tasks",“test_case"]

**User**

| definition | attribute | description |
| ---------- | --------- | ----------- |
|            | user_id   |             |
|            | email     |             |
|            |           |             |
|            |           |             |
|            |           |             |

**Team**

| definition | attribute      | description                                  |
| ---------- | -------------- | -------------------------------------------- |
|            | team_id        | 唯一标识符，每个团队的主键。                 |
|            | name           | 团队的名称。                                 |
|            | description    | 团队的描述，说明团队的目标、职责             |
|            | created_at     | 团队创建的日期和时间。                       |
|            | updated_at     | 团队信息最后更新的日期和时间。               |
|            | manager_id     | 团队领导的唯一标识符，指向用户表的一个外键。 |
|            | member_list    | 团队成员的列表                               |
|            | test_case_list | 团队成员所创建的所有的test case              |



**UserTeam**

| definition | attribute      | description                                        |
| ---------- | -------------- | -------------------------------------------------- |
|            | team_member_id | 唯一标识符，表示团队成员关系的主键。               |
|            | user_id        | 团队的唯一标识符，指向团队表的外键。               |
|            | team_id        | 用户的唯一标识符，表示团队成员，指向用户表的外键。 |
|            | role           | 团队中成员的角色                                   |
|            | joined_at      | 成员加入团队的日期和时间。                         |

用户（user）和团队（team）之间存在多对多（many-to-many）的关系，使用第三张关系表（junction table）来链接这两个表

