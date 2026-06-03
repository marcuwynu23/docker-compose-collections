package 'nginx' do
  action :install
end

service 'nginx' do
  action [:enable, :start]
  supports restart: true, reload: true
end

file '/var/www/html/index.html' do
  content "<h1>Managed by Chef</h1>\n"
  mode '0644'
  notifies :reload, 'service[nginx]'
end

template '/etc/nginx/nginx.conf' do
  source 'nginx.conf.erb'
  mode '0644'
  notifies :reload, 'service[nginx]'
end
