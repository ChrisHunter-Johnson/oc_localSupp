class Task < ApplicationRecord
  belongs_to :raisedBy, :class_name => 'User', optional: true
  belongs_to :resolvedBy, :class_name => 'User',  optional: true

  has_many :offers
  has_many :resolvers, through:  :offers

  has_many :conversations
end
