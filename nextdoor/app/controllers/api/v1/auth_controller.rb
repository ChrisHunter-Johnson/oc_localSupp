
class Api::V1::AuthController < ApplicationController
    def index
      if user_signed_in?
        render :json => {signedIn: true, user: current_user}.to_json()
      else
        render :json => {signedIn: false}.to_json()
      end
    end

    
    def reloadUser
      logger.debug `auth controller reload called with : #{params}`
      @user = User.find(params[:userId])

      render  :json => @user
    end
end