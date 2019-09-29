# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_09_14_065722) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "conversations", force: :cascade do |t|
    t.string "title"
    t.bigint "message_id"
    t.bigint "task_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["message_id"], name: "index_conversations_on_message_id"
    t.index ["task_id"], name: "index_conversations_on_task_id"
  end

  create_table "items", force: :cascade do |t|
    t.integer "type"
    t.string "name"
    t.text "excerpt"
    t.text "description"
    t.string "url"
    t.integer "upvotes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "list_items", force: :cascade do |t|
    t.bigint "list_id"
    t.bigint "item_id"
    t.text "description"
    t.integer "position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["item_id"], name: "index_list_items_on_item_id"
    t.index ["list_id"], name: "index_list_items_on_list_id"
  end

  create_table "lists", force: :cascade do |t|
    t.string "title"
    t.text "excerpt"
    t.text "description"
    t.integer "upvotes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "messages", force: :cascade do |t|
    t.integer "msgSequence"
    t.string "content"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "conversation_id"
    t.index ["conversation_id"], name: "index_messages_on_conversation_id"
    t.index ["user_id"], name: "index_messages_on_user_id"
  end

  create_table "offers", force: :cascade do |t|
    t.bigint "resolver_id"
    t.bigint "task_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["resolver_id"], name: "index_offers_on_resolver_id"
    t.index ["task_id"], name: "index_offers_on_task_id"
  end

  create_table "tasks", force: :cascade do |t|
    t.string "taskType"
    t.string "summary"
    t.string "description"
    t.date "startDate"
    t.string "status"
    t.float "lat"
    t.float "lng"
    t.boolean "fullfilled"
    t.integer "resolverCount"
    t.datetime "raised_on"
    t.boolean "reraised"
    t.integer "numConv"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "raisedBy_id"
    t.bigint "resolvedBy_id"
    t.index ["raisedBy_id"], name: "index_tasks_on_raisedBy_id"
    t.index ["resolvedBy_id"], name: "index_tasks_on_resolvedBy_id"
  end

  create_table "user_conversations", force: :cascade do |t|
    t.string "description"
    t.bigint "user_id"
    t.bigint "conversation_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["conversation_id"], name: "index_user_conversations_on_conversation_id"
    t.index ["user_id"], name: "index_user_conversations_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "first_name"
    t.string "last_name"
    t.string "gov_id_doc", limit: 10485760
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "conversations", "messages"
  add_foreign_key "conversations", "tasks"
  add_foreign_key "list_items", "items"
  add_foreign_key "list_items", "lists"
  add_foreign_key "messages", "conversations"
  add_foreign_key "messages", "users"
  add_foreign_key "offers", "tasks"
  add_foreign_key "offers", "users", column: "resolver_id"
  add_foreign_key "tasks", "users", column: "raisedBy_id"
  add_foreign_key "tasks", "users", column: "resolvedBy_id"
  add_foreign_key "user_conversations", "conversations"
  add_foreign_key "user_conversations", "users"
end
