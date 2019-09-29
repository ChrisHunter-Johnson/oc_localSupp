class Api::V1::ConversationController < ApplicationController
  def index
    @conversations = Conersations.All 

    render json: @conversations
  end

  def create
    
    @conversation = Conversation.new(conversation_params)
    @task = Task.find(@conversation.task_id)
    @task.conversations << @conversation
    
    @task.increment!(:numConv)

    


    
    @raiser = @task.raisedBy
    @resolver = User.find(params[:user_id])

    @raiserConv = UserConversation.new
    @raiserConv.conversation = @conversation
    @raiserConv.user = @raiser
    


    @resolverConv = UserConversation.new
    @resolverConv.conversation = @conversation
    @resolverConv.user = @resolver

    @conversation.user_conversations << @raiserConv
    @conversation.user_conversations << @resolverConv

    
    @task.save
    if @conversation.save

      render json: @conversation, status: :created
    else
      render json: @conversation1.errors, status: :unprocessable_entity
    end







   
    #@task = Task.find(@conversation1.task_id)
    #@task.conversations << @conversation1
    #@user = User.find(params[:user_id])
    #@raiser = @task.raisedBy
    #@conversation2 = Conversation.new(conversation_params)
    #@task.conversations << @conversation2 
   
    #@user.conversations << @conversation1
    #@raiser.conversations << @conversation2

    #@task.numConv = 2

    #@task.save
    #@conversation2.save

   #if@conversation1.save
   # render json: @conversation1, status: :created
   # else
   # render json: @conversation1.errors, status: :unprocessable_entity
   # end
  end

  def countByNeed
    llogger.debug "byNeed params #{params}"
    @counvCount = Task.find(params[:taskId]).conversations.count
    logger.debug @counvCount

    render json: @counvCount, status: :ok

  end

  def byUser
    logger.debug "byUser params #{params}"
    logger.debug "userId #{params[:userId]}"
    @user= User.find(params[:userId])
    logger.debug "@user #{@user}"
    @conversations = @user.conversations
    logger.debug "@conversations #{@conversations}"

    render json: @conversations
  end

  def userList
    logger.debug "conversation id #{params[:convId]}"
    @conv = Conversation.find(params[:convId])
    if @conv
     @users = @conv.users.all
     logger.debug "users found #{@users}"
     render json: @users
    else
      render json: @conv.errors, status: :no_content
    end
  end

  def messageList
    logger.debug "conversation id #{params[:convId]}"
    @conv = Conversation.find(params[:convId])
    if @conv
      @messages = @conv.messages.all
      logger.debug "messages #{@messages}"
      render json: @messages
    else
      render json: @conv.errors, status: :no_content
    end

    
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_task
    @conversation = Conversation.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def conversation_params
      
      params.require(:conversation).permit( :title, :task_id , :user_id )
  end
end
