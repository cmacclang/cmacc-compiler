# cmacc compiler


## Steps
The are different steps the compiler executes to generate the document.

**Loader**  
The loader fetch files from different sources. This can be the local file system or via the network.

**Parser**  
The parser wrapes the Remarkebly library to get variables and md form the cmacc files.

**variables**  
The parser varibles

**Assenble**  
Build the cmacc data object

**Reduce**  
Converts the cmacc data object to cmacc AST

**Compile**  
Generates the AST

**Render**  
Render Html

## Options

**base**  
The base path of the cmacc dir