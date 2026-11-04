import React from 'react'
import KanbanItem from './KanbanItem';
import TaskItem from './TaskItem';
import { TaskStatus, TaskType } from '@/types/workspaceTypes';

interface TaskTabProps{
    tasks:TaskType[];
}
const TaskTab = ({ tasks }: TaskTabProps) => {
    const statusLis = Object.entries(TaskStatus).map(([key, value]) => {
        return {
          key,
          value,
        };
      });
  return (
    <div className="flex flex-row justify-between gap-5 py-6 relative overflow-y-scroll ">
        {statusLis.map((status) => {
          return (
            <KanbanItem key={status.key} title={status.value} badge="50" status={status.key as TaskStatus}>
              {tasks
                .filter((task) => {
                  return task.status === status.key as TaskStatus;
                })
                .map((task, index) => {
                  return <TaskItem key={index} task={task} />;
                })}
            </KanbanItem>
          );
        })}

     
      </div>
  )
}

export default TaskTab
