class Api::V1::ProfileController < ApplicationController
  def resolvingTasks
    @user = User.find(params[:userId])
    
    @resolving = @user.resolver
    render json: @resolving
  end

  def unmetOver24Hr
    @user = User.find(params[:userId])
    #@raisedOver24Hr = @user.raised_tasks
    #.where(status: "open").to_ary
    #.where( ( Time.current.to_time - created_at.to_time ) / 3_600 > 24).to_ary
    #@raisedOver24Hr = Task.where(raisedBy: @user).all
    @raisedOver24Hr = Task.all
    logger.debug "@raisedOver24Hr #{@raisedOver24Hr}"
    
    #.where(status: "open")
    
    #.where( ( Time.current.to_time - created_at.to_time ) / 3_600 > 24);

    render json: @raisedOver24Hr
  end

  def raisedCount
    @user = User.find(params[:userId])
    @raisedTasks = @user.raised_tasks.count
    #@raisedTasks = Task.where(raisedBy: @user)
    logger.debug "@raisedTasks #{@raisedTasks}"
    render json: @raisedTasks
  end

  def resolverCount
    @user = User.find(params[:userId])
    @resolvedTasks = User.resolved_tasks.count

    render json: @resolvedTasks
  end
end
