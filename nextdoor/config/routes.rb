Rails.application.routes.draw do
  
  
  
  
   devise_for :users , defaults: { format: :json }
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  namespace :api do
    namespace :v1 do
      get 'is_signed_in', to: 'auth#index'
      get 'auth/index'
      get 'auth/rails'
      get 'auth/reloadUser'

      get 'task/index'
      get 'task/bounds'
      get 'task/unmetOver24Hr'
      get 'task/open'
      get 'task/myOpen'
      get 'task/complete'
      get 'task/needResolver'
      get 'task/resolverCount'
      get 'task/show'
      get 'task/create'
      get 'task/resolvers'
      post 'task/reRaiseNeed'
      get 'task/resolverTasks'
      get 'task/assignResolver'
      get 'task/update'
      get 'task/destroy'
      get 'task/myFullfilledCount'
      get 'conversation/index'
      get 'conversation/create'
      get 'conversation/countByNeed'
      get 'conversation/byUser'
      get 'conversation/userList'
      get 'conversation/messageList'
      get 'profile/resolvingTasks'
      get 'profile/unmetOver24Hr'
      get 'profile/raisedCount'
      get 'profile/resolverCount'
      post 'message/create'
      get 'message/byConv'

      resources :auth
      resources :task
      resources :conversation
      resources :message
    end
end
#match '*path', to: "application#fallback_index_html", via: :all 


  end