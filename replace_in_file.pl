#!/usr/bin/perl

if(@ARGV == 0)
{
    print STDERR "Usage: $0 <file>

Performs various commands to replace contents of file. Output is to stdout.

Commands are of the form:

<!-- replace_in_file:<command>:<args> -->

Commands are:

block:start:(file)   -- replaces until block:end
block:end            -- finishes a block start
js:(file)            -- replaces line with: 

  <script>
  // automatically copied from (file)
  (file contents...)
  </script>
    ";
exit -1;
}

open(F, $ARGV[0]) || die "Can't open $ARGV[0]";

my $d =  `dirname $ARGV[0]`;
chomp $d;
chdir $d || die;

$mode = 0;

while($_ = <F>)
{
    if(/(.*?)<!--\s*replace_in_file:(.*?):(.*?)\s*-->/)
    {
	print $1;
	run_command($2,$3);
    }
    else
    {
	if($mode == 0)
	{
	    print $_;
	}
    }
}


sub run_command
{
    my ($c, $a) = @_;

    if($mode == 0)
    {
	if($c eq "block")
	{
	    if($a =~ /^start:(.*)/)
	    {
		print "<!-- automatically copied from $1 -->
";
		print_file($1);
		print "
<!-- above automatically copied from $1 -->
";
		$mode = 1; #we only search for 'end' in this mode
	    }
	    elsif($a =~ /^end/)
	    {
		die "Can't have a block:end without a block:start at line: $.";
	    }
	    else
	    {
		die "Can't understand block command, $a at line: $.";
	    }
	}
	elsif($c eq "js")
	{
	    print "<script>
// automatically copied from $a
";
	    print_file($a);
	    print "
// above automatically copied from $a
</script>
";
	}
	else { die "Don't understand command $c:$a"; }
    }
    elsif($mode == 1)
    {
	if($c eq "block" && $a eq "end")
	{
	    $mode = 0;
	}
	else
	{
	    die "Why do you have other commands in a block? $c:$a at line $.";
	}
    }
    else { die "Internal error, illegal mode $mode"; }
}


sub print_file
{
    my ($f) = @_;

    # print "PRINTING FILE $f !!!!";

    open(PF, $f) || die "Can't open $f at line $.";

    while($_ = <PF>)
    {
    	print $_;
    }

    close PF;
}
