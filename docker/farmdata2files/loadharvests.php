<?php
$name = 'worker1';
$user = user_load_by_name($name);
$uid = $user->uid;


$context = array( 'operation'=>'replace',
	'users'=> array($uid)
		);

for ($x = 1; $x <= 481; $x++) {
  farm_log_assign_action(log_load($x), $context);
} 
echo added 481 logs