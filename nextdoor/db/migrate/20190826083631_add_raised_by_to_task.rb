class AddRaisedByToTask < ActiveRecord::Migration[5.2]
  def change
    add_reference :tasks, :raisedBy, foreign_key: { to_table: :users }
    add_reference :tasks, :resolvedBy, foreign_key: { to_table: :users }
  end
end
