import {
  ChangeAssignee,
  CreateTask,
  getTasks,
  UpdateTask,
  ChangeStatus,
  DeleteTask
} from "@/actions/taskActions";
import { OrgMember } from "@/types";
import { TaskType ,TaskStatus } from "@/types/workspaceTypes";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

export default function useTaskStore(workspaceId: string, orgId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["workspace", workspaceId, orgId];
  const taskQuery = useQuery({
    queryKey,
    queryFn: async () => (await getTasks(orgId, workspaceId)).data,
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data:TaskType) =>
      (await CreateTask(orgId, workspaceId, data)).data,
    onSuccess: (createdTask: TaskType) => {
      queryClient.setQueryData<TaskType[]>(queryKey, (tasks = []) => [
        createdTask,
        ...tasks,
      ]);
    },
  });
  const updateTaskMutation = useMutation({
    mutationFn: async ({ data, taskId }: { data: any; taskId: number }) =>
      (await UpdateTask(orgId, workspaceId, data, taskId)).data,
    onSuccess: (updatedTask: TaskType) => {
      queryClient.setQueryData<TaskType[]>(queryKey, (tasks = []) => {
        return tasks.map((task) => {
          return task.id == updatedTask.id ? updatedTask : task;
        });
      });
    },
  });
  const changeAssigneeMutation = useMutation({
    mutationFn: async ({
      taskId,
      memberId,
    }: {
      taskId: number;
      memberId: string;
    }) => (await ChangeAssignee(orgId, workspaceId, taskId, memberId)).data,
    onSuccess: ({ memberId, taskId }: { memberId: number; taskId: number }) => {
      queryClient.setQueryData<TaskType[]>(queryKey, (tasks = []) => {
        return tasks.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              memberId,
            };
          }
          return task;
        });
      });
    },
  });

  const changeStatusTask = useMutation({
    mutationFn:async({task,status}:{task:TaskType,status:TaskStatus})=>{
        await ChangeStatus(orgId,workspaceId,task.id,status)
        task.status=status
        return task
    },
    onSuccess:(updatedtask)=>{
        queryClient.setQueryData<TaskType []>(queryKey,(tasks)=>{
            return tasks.map((task)=>{
              return task.id===updatedtask.id ? updatedtask : task;
            })
        })

        }
  })
const deleteTaskMutation =useMutation({
    mutationFn:async(taskId:number)=>{
        await DeleteTask(orgId,workspaceId,taskId);
        return taskId
    },
    onSuccess:(taskId)=>{
        queryClient.setQueryData<TaskType []>(queryKey,(tasks)=>{
            return tasks.filter((task)=>{
                return task.id !==taskId 
            })
        })
    }
})
  return {
    tasks: taskQuery.data,
    isloading: taskQuery.isLoading,
    isError: taskQuery.isError,
    error: taskQuery.error?.message,
    createTask: createTaskMutation.mutate,
    submitting: createTaskMutation.isPending,
    updateTask: updateTaskMutation.mutate,
    isEdditing: updateTaskMutation.isPending,
    changeAsignee:changeAssigneeMutation.mutate,
    changeStatusTask:changeStatusTask.mutate,
    deleteTask:deleteTaskMutation.mutate
  };
}
