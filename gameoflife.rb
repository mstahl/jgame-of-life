
require 'rubygems'
require 'sinatra'

get '/' do
  haml :home
end

get '/stylesheets/:name.css' do
  content_type 'text/css', :charset => 'utf-8'

  sass(:"/stylesheets/#{params[:name]}")
end
