module Api::V1
  class TaskController < ApplicationController
    def index
      @tasks = Task.all
      render json: @tasks
    end

    def bounds
      @tasks = Task
      .where(lat: params[:lat_start] .. params[:lat_end])
      .where(lng: params[:lng_end] .. params[:lng_start])
      .where(status: "open").where('raised_on > ? ',24.hours.ago).all
      render json: @tasks
    end

    def unmetOver24Hr
      @user = User.find(params[:userId])
      @raisedOver24Hr = Task
      .where(status: "open")
      .where('raised_on < ? ',24.hours.ago)
      .where(raisedBy: @user ).all
  
    r ender json: @raisedOver24Hr
    end

    def open
      @tasks = Task.where(status: "open")
     .where('raised_on > ? ',24.hours.ago).count 
    
     render json: @tasks
    end

    def myOpen
      @user = User.find(params[:userId])
      @tasks = Task.where(status: "open")
                    .where(raisedBy: @user).all
    
      render json: @tasks
    end

    def complete
      @task = Task.find(params[:id])
      @task.status = "closed"
      if @task.save
        render json: @task, status: :ok
      else
        render json: @task.errors, status: :unprocessable_entity
      end
    end

    def needResolver
      @user = User.find(params[:userId])
      @resolving = @user.tasks.all
  
      render json: @resolving
    end

    def resolverCount
      @task = Task.find(params[:id])
      @task = @task.resolvers.count

      render json: @task
    end

    def show
      render json: @task
    end

    def create
      @task = Task.new(task_params)
      @raisedBy = User.find(params[:userId])
      @task.raisedBy = @raisedBy
      @task.raised_on = Time.current
      @task.reraised = false

      if @task.save
        render json: @task, status: :created
      else
        render json: @task.errors, status: :unprocessable_entity
      end
    end

    def resolvers
      @task = Task.find(params[:taskId])
      if @task
        render json: @task.resolvers
      else
        render json: @task.errors, status: :unprocessable_entity
      end
    end

    def reRaiseNeed
      logger.debug "params: #{params[:taskId]}"
      @task =Task.find(params[:taskId])
    
      @task.raised_on = Time.current()
      @task.reraised = true
      logger.debug "@Task #{@task}"
      if@task.save
        render json: @task, status: :ok
      else
        render json: @task.errors, status: :unprocessable_entity
      end
    end

    def resolverTasks
      @resolver = User.find(params[:userId])

      @task = Task.includes(:resolvers, :offers)
      .where('resolvers.id = ?',@resolver.id)
    end

    def assignResolver
      @task = Task.find(params[:taskId])
      @resolver = User.find(params[:userId])
    
      @task.resolvers<< @resolver
      logger.debug "resolvers #{@task.resolvers}"

      if@task.save
        render json: @task,  status: :ok
      else
        render json: @task.errors, status: :not_modified
      end
    end

    def update
      if @task.update(task_params)
        render json: @task
      else
        render json: @task.errors, status: :unprocessable_entity
      end
    end

    def destroy
      @task.destroy
    end

    private
    # Use callbacks to share common setup or constraints between actions.
    def set_task
      @task = Task.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def task_params
      params.require(:task).permit(:summary, :description,  
      :startdate, :status, :fullfilled, :lat, :lng, :taskType, 
      :raisedBy, :raised_on, :reraised  )
    end

  end
end