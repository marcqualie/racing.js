<?php

// File
$files = array(
	'mootools/core.js', 'mootools/more.js',
	'lib/point.js', 'lib/resource.js',
	'lib/map.js', 'lib/player.js', 'lib/racing.js'
);

// Which game to compiled?
$files[] = 'game_init.js';

// Compile Code
$cmd = "java -jar compiler.jar";
//$cmd .= " --compilation_level ADVANCED_OPTIMIZATIONS";
$cmd .= " --js";
foreach ($files as $file)
{
	$cmd .= " {$file}";
}
$cmd .= " --js_output_file compiled.tmp.js";
exec($cmd);
$script = file_get_contents('compiled.tmp.js');
unlink('compiled.tmp.js');

// Put Code Into File
$out = '<!DOCTYPE html>
<html>
  <head><title>Game</title></head>
<body>
<script>' . $script . '</script>
</body>
</html>';
file_put_contents('prototype1.html', $out);

// Output
echo 'Complete' . PHP_EOL;
