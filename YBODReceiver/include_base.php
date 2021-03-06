<?

class BaseObject {

  function get_create_table_sql () {
    $fields = $this->getFields();
    $sql = 'CREATE TABLE '.$this->getTableName().' (';
    foreach ($fields as $FieldName => $FieldOptions) {
      $sql.= $FieldName . ' ';
      switch($FieldOptions['type']) {
        case 'int':
          $sql.= 'INTEGER '; break;
        case 'primarykey':
          $sql.= 'INTEGER AUTO_INCREMENT PRIMARY KEY '; break;
        case 'string':
          $sql.= 'VARCHAR(255) '; break;
        case 'datetime':
          $sql.= 'DATETIME '; break;
        case 'text':
          $sql.= 'TEXT '; break;
        default: 
          echo 'unknown datatype ' . $FieldOptions['type'] . ' for ' . $FieldName . '!';
      }
      $sql.= ', ';
    }
    $sql = substr($sql,0,-2);

    $sql.= ')';

    return $sql;
  }

  function __construct($data = Array()) {
    $this->initialiseData($data);
  }

  function getFields () {
    return $this->fields;
  }
  function getFieldNames() {
	return array_keys($this->fields);
  }

  function getField($FieldName) {
    return $this->fields[$FieldName];
  }

  function getPrimaryKey () {
    if ($this->primarykeyfield!='') {
      return $this->values[$this->primarykeyfield];
    }
  }

  function is_new() {
    return $this->getPrimaryKey()<=0;
  }

  function hasField ($FieldName) {
    return in_array($FieldName, $this->getFieldNames());	
  }
  function setValue ($FieldName, $value) {
    $this->values[$FieldName] = $value;
  }
  function getValue ($FieldName) {
    return $this->values[$FieldName];
  }
  function getDBValue ($FieldName) {
    $f = $this->getField($FieldName);
    $value = $this->getValue($FieldName);

    if ($f['type']=='datetime') $value = Date('Y-m-d H:m:s', $value);

    $value = escape($value);

    return $value;
  }
  function initialiseData($data) {
    //print_rp($data, 'initialiseData for ' . get_class($this) . ' passed data:');
    foreach ($this->getFields() as $FieldName => $FieldOptions) {
      $this->setValue($FieldName, $data->$FieldName);
      if ($FieldOptions['type']=='primarykey') {
        $this->primarykeyfield = $FieldName;
      }
    }
	if ($this->hasField('CreatedByUserID') && !$this->getValue('CreatedByUserID')) {
		//print 'setting UserID to ' . getUserID() . '<br>';
		$this->setValue('CreatedByUserID', getUserID());
	}
  }

  function save() {
    //print_rp ($this->values, "save values:");
    if ($this->is_new()) {
      $sql = 'INSERT INTO ' . $this->getTableName() . ' ';
      foreach ($this->getFields() as $FieldName => $FieldOptions) {
        $sql_fields.= $FieldName . ', ';
        $sql_values.= "'" . $this->getDBValue($FieldName) . "', ";
      }
      $sql_fields = substr($sql_fields,0,-2);
      $sql_values = substr($sql_values,0,-2);
      $sql.= '(' . $sql_fields . ') VALUES (' . $sql_values . ')';
    } else {
      $sql = 'UPDATE ' . $this->getTableName() . ' SET ';
      foreach ($this->getFields() as $FieldName => $FieldOptions) {
        $sql.= $FieldName . "='" . $this->getDBValue($FieldName) . "', ";
      }
      $sql = substr($sql,0,-2);
      $sql.= ' WHERE ' . $this->primarykeyfield . '="' . escape($this->getPrimaryKey()) . '" ';
    }

    //print 'save() produced sql :' . $sql;
    debug("save() produced sql :" . $sql);
    
    $result = db_query($sql) or finisherror ('SQL error running ' . $sql . ', :' . db_error()); 
    return $result;
  }

  static function load($id) {
    $sql = 'SELECT * FROM ' . $this->getTableName() . ' WHERE ' . $this->primarykeyfield . '="' . escape($id) . '"';
    $results = db_query($sql) or finisherror('Error loading data: $sql' . db_error());
    if (db_num_rows($results)>0) {
      $result = db_fetch_object($results);
      return $this->newObject($result);
    }
  } 
  static function newObject($data) {
    $classname = get_class($this);
    return new $classname($data);
  } 
}
