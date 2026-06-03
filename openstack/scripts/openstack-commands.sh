# List available images
openstack image list

# List flavors (instance sizes)
openstack flavor list

# List networks
openstack network list

# List running instances
openstack server list

# List projects (tenants)
openstack project list

# List users
openstack user list

# Show endpoint catalog
openstack catalog list

# Show quota for current project
openstack quota show

# Create a new project
openstack project create --description "Development project" dev-project

# Create a user and assign to project
openstack user create --password changeme --project dev-project dev-user
openstack role add --user dev-user --project dev-project member

# Launch an instance
openstack server create --flavor m1.tiny --image cirros --network public --key-name mykey my-instance

# Create a volume and attach it
openstack volume create --size 10 my-volume
openstack server add volume my-instance my-volume

# Create a security group with rules
openstack security group create web-sg
openstack security group rule create --proto tcp --dst-port 22 web-sg
openstack security group rule create --proto tcp --dst-port 80 web-sg
