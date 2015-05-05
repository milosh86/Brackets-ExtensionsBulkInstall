<h1>What:</h1> 
I want to build Brackets Extension that will allow me to install automatically a group of extensions defined in a file. Format of file should be JSON. Also, extension should have an option to generate compatible JSON file based on currently installed extensions.
<h1>Why:</h1> 
* Easy way to save and maintain the list of favorite extensions
* Easy way to install a group of favorite extensions
* Easy sharing of such a lists
<h1>Features:</h1>
* Export the list of currently installed extensions. (save to file or show in popup window)
	* export all installed extensions
	* export only selected extensions
* Install a group of extensions based on selected file and generate a report
	* Extensions that are already installed are skipped and reported
	* Extensions with invalid name (not found in registry) are skipped and reported
	* Newly installed extensions are reported
	
