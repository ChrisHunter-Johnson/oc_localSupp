class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

         has_many :raised_tasks, :class_name => 'Task', :foreign_key => 'raisedBy_id'
         has_many :resolved_tasks, :class_name => 'Task', :foreign_key => 'resolvedBy_id'
         has_many :offers, :foreign_key => 'resolver_id'
         has_many :tasks, through:  :offers

         has_many :user_conversations
         has_many :conversations , through:  :user_conversations
         has_many :messages       
end
