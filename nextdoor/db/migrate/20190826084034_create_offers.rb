class CreateOffers < ActiveRecord::Migration[5.2]
  def change
    create_table :offers do |t|
      t.references :resolver, index: true, foreign_key: { to_table: :users }
      t.references :task, index: true,foreign_key: true

      t.timestamps
    end
  end
end
