class Api::V1::MessageController < ApplicationController
  def create
    logger.debug "message_params -#{message_params}"
    @message = Message.new(message_params)

    @user = User.find(params[:params][:userId])
    @conv = Conversation.find(params[:params][:convId])
    @message.user = @user
    @message.conversation = @conv

    @user.messages << @message
    @conv.messages << @message

    if @message.save
      render json: @message, status: :created
    else
      render json: @message.errors, status: :unprocessable_entity
    end

  end

  def byConv
    logger.debug "params -#{params}"
    @conv = Conversation.find(params[:convId])
    @messages = @conv.messages.order('created_at DESC')

    if @messages
      render json: @messages, status: :ok
    else
      ender json: @messages.errors, status: :no_content
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_message
      @message = Message.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def message_params
      params.require(:message).permit(:content
        )
    end
end
