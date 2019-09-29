class Conversation < ApplicationRecord
 # belongs_to :message
 # belongs_to :task

  belongs_to :task

  has_many :user_conversations, autosave: true
  has_many :users, through: :user_conversations 
  has_many :messages
end
