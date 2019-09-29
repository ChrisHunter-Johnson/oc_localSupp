class CreateTasks < ActiveRecord::Migration[5.2]
  def change
    create_table :tasks do |t|
      t.string :taskType
      t.string :summary
      t.string :description
      t.date :startDate
      t.string :status
      t.float :lat
      t.float :lng
      t.boolean :fullfilled
      t.integer :resolverCount
      t.datetime :raised_on
      t.boolean :reraised
      t.integer :numConv

      t.timestamps
    end
  end
end
