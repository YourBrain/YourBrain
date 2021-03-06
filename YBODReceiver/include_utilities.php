<?

function debug ($text) {
  global $debug_file;
  if (!$debug_file) $debug_file = fopen('debug.log','a');
  fwrite ($debug_file, date(DATE_RFC822) . ':' . $text . "\n");
}

function print_rp($var, $message = '', $log = true) {
  if (!$log) {
    print "\n\n$message: <pre>";
    print_r($var);
    print "</pre>\n\n";
  }
  if ($log) debug($message . ':' . print_r($var, true));
}

function __autoload($classname) {
  include 'object_'.$classname.'.php';
}

function finisherror($message = '') {
  print "Fatal ybod_receiver error: " . htmlspecialchars($message) . "\n\n";
  print_rp (debug_backtrace())."\n\n";
  exit;
  exit;
}

function escape($t) {
  global $DB_DISABLE;
  if (!$DB_DISABLE) {
    return mysql_real_escape_string($t);
  } else {
    return addslashes($t);
  }
}

function getUserID () {
	global $_USERID;
	return $_USERID;
}
function setUserID ($n) {
	global $_USERID;
	$_USERID = $n;
}

function getUUID () {
  global $_USERID;
  return $_USERID;
}
function setUUID ($uuid) {
  global $_UUID;
  $_UUID = $uuid;
}


function getLastGameScoreIDForUUID ($UUID) {
  $sql = "SELECT MAX(GameScoreID) AS LastID FROM receive_GameScore WHERE UUID='${UUID}'";
  $result = db_query($sql) or finisherror ("SQL error getting LastGameScoreIDForUUID '$sql': " . db_error());

  $result = db_fetch_object($result);
  return $result->LastID;
}

?>
