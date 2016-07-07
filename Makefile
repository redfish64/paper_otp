
all: index.html

clean:
	rm index.html

index.html: src/index_src.html
	perl replace_in_file.pl src/index_src.html > index.html
