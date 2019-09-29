class Offer < ApplicationRecord
  belongs_to :resolver, :class_name => 'User', :foreign_key => 'resolver_id'
  belongs_to :task
end
