# FPGA Digital Filter in VHDL

A streaming digital filter in VHDL controlled by a FSM and interfacing with a single-port memory. 
- Conducted design, synthesis, simulation, and created testbenches. 
- Achieved 6.43 ns critical path.
- Synthesized and verified the design in Xilinx Vivado: 738 LUTs and 163 registers with no DSP/RAM blocks, meeting a 
20 ns clock constraint with 13.521 ns slack
- Developed and passed reset, saturation, and large-input testbenches.

[GitHub repository](https://github.com/renonesopocaj/vhdl-filter-fpga)

<!-- COMPLETE ORIGINAL REPORT -->
<div class="report report-vhdl-filter-fpga">
<div class='maketitle'>
<h2 class='titleHead'>Logic Networks Project Report</h2>
 <div class='author'><span class='ec-lmss-12'>Jacopo Senoner 10827820, Alessandro Tinaoui 10896741</span></div>
<br />
<div class='date'></div>
</div>
<!-- l. 119 --><p class='noindent'>The following project was carried out in pairs by the students Jacopo Senoner, student ID code 213230
and person code 10827820, and Alessandro Tinaoui, student ID code 214615 and person code
10896741.
</p>
<h3 class='likesectionHead' id='contents'><a id='x1-1000'></a>Contents</h3>
<div class='tableofcontents'>
<span class='sectionToc'>1 <a href='#introduction' id='QQ2-1-2'>Introduction</a></span>
<br /><span class='subsectionToc'>1.1 <a href='#brief-overview' id='QQ2-1-3'>Brief overview</a></span>
<br /><span class='subsectionToc'>1.2 <a href='#filter-operation' id='QQ2-1-4'>Filter operation</a></span>
<br /><span class='sectionToc'>2 <a href='#architecture' id='QQ2-1-6'>Architecture</a></span>
<br /><span class='subsectionToc'>2.1 <a href='#initial-highlevel-schematic' id='QQ2-1-7'>Initial high-level schematic</a></span>
<br /><span class='subsectionToc'>2.2 <a href='#code-documentation' id='QQ2-1-13'>Code documentation</a></span>
<br /><span class='subsectionToc'>2.3 <a href='#state-machine' id='QQ2-1-14'>State machine</a></span>
<br /><span class='sectionToc'>3 <a href='#experimental-results' id='QQ2-1-16'>Experimental results</a></span>
<br /><span class='subsectionToc'>3.1 <a href='#synthesis' id='QQ2-1-17'>Synthesis</a></span>
<br /><span class='subsubsectionToc'>3.1.1 <a href='#utilization-report' id='QQ2-1-18'>Utilization Report</a></span>
<br /><span class='subsubsectionToc'>3.1.2 <a href='#timing-report' id='QQ2-1-21'>Timing Report</a></span>
<br /><span class='subsectionToc'>3.2 <a href='#simulations' id='QQ2-1-23'>Simulations</a></span>
<br /><span class='subsubsectionToc'>3.2.1 <a href='#testbench-' id='QQ2-1-24'>Testbench 1 - 4</a></span>
<br /><span class='subsubsectionToc'>3.2.2 <a href='#testbench-mark' id='QQ2-1-25'>Testbench 5: Mark2</a></span>
<br /><span class='sectionToc'>4 <a href='#conclusions' id='QQ2-1-26'>Conclusions</a></span>
</div>
<h3 class='sectionHead' id='introduction'><span class='titlemark'>1   </span> <a id='x1-20001'></a>Introduction</h3>
<h4 class='subsectionHead' id='brief-overview'><span class='titlemark'>1.1   </span> <a id='x1-30001.1'></a>Brief overview</h4>
<!-- l. 127 --><p class='noindent'>We can rework the specification into 3 computation phases:
</p>
<dl class='enumerate-enumitem'><dt class='enumerate-enumitem'>
1.
</dt><dd class='enumerate-enumitem'>Reading, from memory, the coefficients used throughout the filter: we need to read <!-- l. 129 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>K</mi><mn>1</mn></mrow></math></span>,
<!-- l. 129 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>K</mi><mn>2</mn></mrow></math></span>,
<!-- l. 129 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>S</mi></math></span>,
<!-- l. 129 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>C</mi><mn>1</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mi>…</mi><mo class='MathClass-punc' stretchy='false'>,</mo><mi>C</mi><mn>7</mn></mrow></math></span>,
which will remain constant for the entire computation.
</dd>
<dt class='enumerate-enumitem'>
2.
</dt><dd class='enumerate-enumitem'>Reading, from memory, the <!-- l. 130 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>f</mi><mo class='MathClass-open' stretchy='false'>(</mo><mi>i</mi><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>
for <!-- l. 130 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>i</mi> <mo class='MathClass-rel' stretchy='false'>∈</mo> <mo class='MathClass-open' stretchy='false'>[</mo><mn>1</mn><mo class='MathClass-punc' stretchy='false'>.</mo><mo class='MathClass-punc' stretchy='false'>.</mo><mi>k</mi><mo class='MathClass-close' stretchy='false'>]</mo><mo class='MathClass-punc' stretchy='false'>,</mo><mi>i</mi> <mo class='MathClass-punc' stretchy='false'>:</mo><mo class='MathClass-rel' stretchy='false'>=</mo> <mi>j</mi><mo class='MathClass-punc' stretchy='false'>,</mo><mi>…</mi><mo class='MathClass-punc' stretchy='false'>,</mo><mi>j</mi> <mo class='MathClass-bin' stretchy='false'>+</mo> <mn>6</mn></mrow></math></span>
for some appropriate <!-- l. 130 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>j</mi></math></span>
(in memory <!-- l. 130 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msub><mrow><mi>W</mi></mrow><mrow><mi>j</mi></mrow></msub><mo class='MathClass-punc' stretchy='false'>,</mo><mi>…</mi><mo class='MathClass-punc' stretchy='false'>,</mo><msub><mrow><mi>W</mi></mrow><mrow><mi>j</mi><mo class='MathClass-bin' stretchy='false'>+</mo><mn>6</mn></mrow></msub></mrow></math></span>),
which in principle should be re-read at every step (we will not do exactly this, but for now we gloss
over the implementation).
</dd>
<dt class='enumerate-enumitem'>
3.
</dt><dd class='enumerate-enumitem'>Given <!-- l. 131 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msub><mrow><mi>W</mi></mrow><mrow><mi>j</mi></mrow></msub><mo class='MathClass-punc' stretchy='false'>,</mo><mo class='MathClass-punc' stretchy='false'>.</mo><mo class='MathClass-punc' stretchy='false'>.</mo><mo class='MathClass-punc' stretchy='false'>.</mo><mo class='MathClass-punc' stretchy='false'>,</mo><msub><mrow><mi>W</mi></mrow><mrow><mi>j</mi><mo class='MathClass-bin' stretchy='false'>+</mo><mn>6</mn></mrow></msub></mrow></math></span>,
a sequence of <!-- l. 131 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mn>7</mn></math></span>
consecutive cells, we compute the filtered value and write it into the appropriate memory cell
<!-- l. 131 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>R</mi></math></span>.</dd></dl>
<!-- l. 134 --><p class='noindent'>We also note that the memory has a single port, which means we will not be able to write and read
simultaneously.
</p>
<h4 class='subsectionHead' id='filter-operation'><span class='titlemark'>1.2   </span> <a id='x1-40001.2'></a>Filter operation</h4>
<!-- l. 138 --><p class='noindent'>For now, we analyze the filter simply as it was given to us, independently of the implementation.
</p><!-- l. 140 --><p class='noindent'>We can immediately notice that it starts from <!-- l. 140 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mi>W</mi></mrow><mrow><mn>1</mn></mrow></msub></math></span>
and scans, effectively implementing a <span class='ec-lmsso-10'>sliding window</span>. Being analogous in this sense to some well-known filters
(for example convolution in CNNs), it can be useful to view the filter similarly; therefore we can attribute to it a
<span class='ec-lmsso-10'>stride </span>of 1 and a <span class='ec-lmsso-10'>padding </span>that adds three dummy zeros to the left and three dummy zeros to the right of the
<!-- l. 140 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>W</mi></math></span>
vector.
</p><!-- l. 142 --><p class='noindent'>Thus we can visualize the application of an example filter of order 5 as follows:
</p>
<figure class='figure'>
<!-- l. 146 --><p class='noindent' id='simulation-of-a-filter-computation'><img alt='PIC' src='report/img/calcolo_filtro_simulato.jpg' /> <a id='x1-4001r1'></a>
</p>
<figcaption class='caption'><span class='id'>Figure 1: </span><span class='content'>Simulation of a filter computation.                                               </span></figcaption><!-- tex4ht:label?: x1-4001r1  -->
</figure>
<!-- l. 151 --><p class='noindent'>Regarding normalization, we can observe instead that
<!-- l. 151 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>12</mn></mrow></math></span> (and
<!-- l. 151 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>60</mn></mrow></math></span>) have been approximated
with sums of powers of <!-- l. 151 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mn>2</mn></math></span>
in order to make division operations less computationally expensive. In particular, division by
<!-- l. 151 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>12</mn></mrow></math></span> (and by
<!-- l. 151 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>60</mn></mrow></math></span>) can
be reduced to a series of sums and shift operations, thanks to the distributive property of
addition over multiplication and to the fact that each division/multiplication by a power of
<!-- l. 151 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mn>2</mn></math></span> is a
right/left shift.
</p>
<h3 class='sectionHead' id='architecture'><span class='titlemark'>2   </span> <a id='x1-50002'></a>Architecture</h3>
<!-- l. 164 --><p class='noindent'>We start by presenting the initial high-level design phase, on paper, of the circuit, and then
continue by presenting the documentation of the final VHDL code and the final state
machine. An important note, to avoid confusion, is that the memory values denoted by
<!-- l. 165 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>W</mi></math></span>, which the filter takes as input,
are stored in registers called <!-- l. 165 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>T</mi></math></span>.
Therefore, during the computation of the filtered value associated with
<!-- l. 165 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mi>W</mi></mrow><mrow><mi>j</mi></mrow></msub></math></span>, we will
have
<!-- tex4ht:inline --></p><!-- l. 165 --><math display='block' xmlns='http://www.w3.org/1998/Math/MathML'><mrow>
    <msub><mrow><mi>T</mi></mrow><mrow><mn>1</mn></mrow></msub> <mo class='MathClass-punc' stretchy='false'>:</mo><mo class='MathClass-rel' stretchy='false'>=</mo> <msub><mrow><mi>W</mi></mrow><mrow><mi>j</mi><mo class='MathClass-bin' stretchy='false'>−</mo><mn>3</mn></mrow></msub><mo class='MathClass-punc' stretchy='false'>,</mo><msub><mrow><mi>T</mi></mrow><mrow><mn>2</mn></mrow></msub> <mo class='MathClass-punc' stretchy='false'>:</mo><mo class='MathClass-rel' stretchy='false'>=</mo> <msub><mrow><mi>W</mi></mrow><mrow><mi>j</mi><mo class='MathClass-bin' stretchy='false'>−</mo><mn>2</mn></mrow></msub><mo class='MathClass-punc' stretchy='false'>,</mo><msub><mrow><mi>T</mi></mrow><mrow><mn>3</mn></mrow></msub> <mo class='MathClass-punc' stretchy='false'>:</mo><mo class='MathClass-rel' stretchy='false'>=</mo> <msub><mrow><mi>W</mi></mrow><mrow><mi>j</mi><mo class='MathClass-bin' stretchy='false'>−</mo><mn>1</mn></mrow></msub><mo class='MathClass-punc' stretchy='false'>,</mo><msub><mrow><mi>T</mi></mrow><mrow><mn>4</mn></mrow></msub> <mo class='MathClass-punc' stretchy='false'>:</mo><mo class='MathClass-rel' stretchy='false'>=</mo> <msub><mrow><mi>W</mi></mrow><mrow><mi>j</mi></mrow></msub><mo class='MathClass-punc' stretchy='false'>,</mo><msub><mrow><mi>T</mi></mrow><mrow><mn>5</mn></mrow></msub> <mo class='MathClass-punc' stretchy='false'>:</mo><mo class='MathClass-rel' stretchy='false'>=</mo> <msub><mrow><mi>W</mi></mrow><mrow><mi>j</mi><mo class='MathClass-bin' stretchy='false'>+</mo><mn>1</mn></mrow></msub><mo class='MathClass-punc' stretchy='false'>,</mo><msub><mrow><mi>T</mi></mrow><mrow><mn>6</mn></mrow></msub> <mo class='MathClass-punc' stretchy='false'>:</mo><mo class='MathClass-rel' stretchy='false'>=</mo> <msub><mrow><mi>W</mi></mrow><mrow><mi>j</mi><mo class='MathClass-bin' stretchy='false'>+</mo><mn>2</mn></mrow></msub><mo class='MathClass-punc' stretchy='false'>,</mo><msub><mrow><mi>T</mi></mrow><mrow><mn>7</mn></mrow></msub> <mo class='MathClass-punc' stretchy='false'>:</mo><mo class='MathClass-rel' stretchy='false'>=</mo> <msub><mrow><mi>W</mi></mrow><mrow><mi>j</mi><mo class='MathClass-bin' stretchy='false'>+</mo><mn>3</mn></mrow></msub>
</mrow></math>
<!-- l. 165 --><p class='nopar'>
</p>
<h4 class='subsectionHead' id='initial-highlevel-schematic'><span class='titlemark'>2.1   </span> <a id='x1-60002.1'></a>Initial high-level schematic</h4>
<h5 class='likesubsubsectionHead' id='overview'><a id='x1-7000'></a>Overview</h5>
<!-- l. 171 --><p class='noindent'>The schematic (Figure <a href='#highlevel-schematic-circuit-of-the-project-note-that-the-names-on-registers-ww-should-actually-be-tt-consistently-with-the-distinction-already-explained'>2<!-- tex4ht:ref: fig:circuitopanoramica  --></a>) is reported here with the following notes: </p>
<ul class='itemize1'>
<li class='itemize'>the memory is omitted.
</li>
<li class='itemize'>the enable signals for writing into the registers are omitted, which are controlled (and thus would
“come out”) from the <span class='ec-lmsso-10'>FSM</span>.
</li>
<li class='itemize'>reset, clock, start signals are omitted.
</li>
<li class='itemize'>the filter computation part is entirely combinational and is reported in full below.
</li>
<li class='itemize'>each signal has the appropriate number of bits.</li></ul>
<!-- l. 179 --><p class='noindent'>Moreover: </p>
<ul class='itemize1'>
<li class='itemize'>yellow part: reading the coefficients that remain constant during computation.
</li>
<li class='itemize'>red part: reading from memory, writing into <!-- l. 182 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mi>T</mi></mrow><mrow><mn>7</mn></mrow></msub></math></span>
and “sliding the window”, i.e., <!-- l. 182 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msub><mrow><mi>T</mi></mrow><mrow><mn>1</mn></mrow></msub> <mo class='MathClass-punc' stretchy='false'>:</mo><mo class='MathClass-rel' stretchy='false'>=</mo> <msub><mrow><mi>T</mi></mrow><mrow><mn>2</mn></mrow></msub><mo class='MathClass-punc' stretchy='false'>,</mo><msub><mrow><mi>T</mi></mrow><mrow><mn>2</mn></mrow></msub> <mo class='MathClass-punc' stretchy='false'>:</mo><mo class='MathClass-rel' stretchy='false'>=</mo> <msub><mrow><mi>T</mi></mrow><mrow><mn>3</mn></mrow></msub><mo class='MathClass-punc' stretchy='false'>,</mo><mi>…</mi><mo class='MathClass-punc' stretchy='false'>,</mo><msub><mrow><mi>T</mi></mrow><mrow><mn>6</mn></mrow></msub> <mo class='MathClass-punc' stretchy='false'>:</mo><mo class='MathClass-rel' stretchy='false'>=</mo> <msub><mrow><mi>T</mi></mrow><mrow><mn>7</mn></mrow></msub><mo class='MathClass-punc' stretchy='false'>,</mo><msub><mrow><mi>T</mi></mrow><mrow><mn>7</mn></mrow></msub> <mo class='MathClass-punc' stretchy='false'>:</mo><mo class='MathClass-rel' stretchy='false'>=</mo> <mstyle class='text'><mtext>&lt;new value read from memory&gt;</mtext></mstyle></mrow></math></span>
<a id='scorrimentofinestra'></a> <a href='#scorrimentofinestra'>We will refer to this procedure as (1)</a>.
</li>
<li class='itemize'>light-blue part: zeroing coefficients <!-- l. 183 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msub><mrow><mi>C</mi></mrow><mrow><mn>1</mn></mrow></msub><mo class='MathClass-punc' stretchy='false'>,</mo><msub><mrow><mi>C</mi></mrow><mrow><mn>7</mn></mrow></msub></mrow></math></span>
in the case of an order-3 filter thanks to a mux whose selection signal is the LSB of <!-- l. 183 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>S</mi></math></span>.
</li>
<li class='itemize'>green part: adding the offset (computed by the FSM) to the <!-- l. 184 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>ADD</mi></mstyle></math></span>
address, to obtain the final write or read address.
</li>
<li class='itemize'>Filter computation: entirely combinational part, see below.
</li>
<li class='itemize'>FSM: state machine that controls the signals for writing into the registers and the offset signal.</li></ul>
<figure class='figure' id='x1-7001r2'><span id='highlevel-schematic-circuit-of-the-project-note-that-the-names-on-registers-ww-should-actually-be-tt-consistently-with-the-distinction-already-explained'></span>
 <img alt='PIC' src='report/img/pre_project_schematic.jpg' />
<figcaption class='caption'><span class='id'>Figure 2:   </span><span class='content'>High-level   schematic   circuit   of   the   project.   Note   that   the   names   on   registers
<!-- l. 191 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msub><mrow><mi>W</mi></mrow><mrow><mn>1</mn></mrow></msub> <mo class='MathClass-bin' stretchy='false'>−</mo> <msub><mrow><mi>W</mi></mrow><mrow><mn>7</mn></mrow></msub></mrow></math></span>
should actually be <!-- l. 191 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msub><mrow><mi>T</mi></mrow><mrow><mn>1</mn></mrow></msub> <mo class='MathClass-bin' stretchy='false'>−</mo> <msub><mrow><mi>T</mi></mrow><mrow><mn>7</mn></mrow></msub></mrow></math></span>,
consistently with the distinction already explained.                                           </span></figcaption><!-- tex4ht:label?: x1-7001r2  -->
</figure>
<!-- l. 195 --><p class='noindent'>
</p>
<h5 class='likesubsubsectionHead' id='combinational-part-for-filter-computation'><a id='x1-8000'></a>Combinational part for filter computation</h5>
<p><a id='x1-8000doc'></a>
<!-- l. 198 --></p><p class='noindent'>The combinational part for computing the filtered value is shown here in detail (Figure <a href='#schematic-circuit-of-the-filter-computation-part-note-that-the-names-on-registers-ww-should-actually-be-tt-consistently-with-the-distinction-already-explained'>3<!-- tex4ht:ref: fig:filtrodettagliato  --></a>): it is a fairly direct
implementation of the mathematical expression of the filter. There are some things to observe, due to the fact that we
only write into <!-- l. 198 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mi>T</mi></mrow><mrow><mn>7</mn></mrow></msub></math></span>:
</p>
<dl class='enumerate-enumitem'><dt class='enumerate-enumitem'>
1.
</dt><dd class='enumerate-enumitem'>for the first 3 computations to work starting from <!-- l. 200 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mi>W</mi></mrow><mrow><mn>1</mn></mrow></msub></math></span>,
“dummy zeros” would need to be added to the left of <!-- l. 200 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mi>W</mi></mrow><mrow><mn>1</mn></mrow></msub></math></span>.
This is implemented as follows: three times, zeros are assigned to <!-- l. 200 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mi>T</mi></mrow><mrow><mn>7</mn></mrow></msub></math></span>,
and then the assignment of the actual values <!-- l. 200 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mi>W</mi></mrow><mrow><mn>1</mn></mrow></msub></math></span>
to <!-- l. 200 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mi>T</mi></mrow><mrow><mn>7</mn></mrow></msub></math></span>
begins. When the first zero reaches <!-- l. 200 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mi>T</mi></mrow><mrow><mn>1</mn></mrow></msub></math></span>,
the effective computation can begin, with <!-- l. 200 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mi>T</mi></mrow><mrow><mn>4</mn></mrow></msub></math></span>
containing <!-- l. 200 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mi>W</mi></mrow><mrow><mn>1</mn></mrow></msub></math></span>.
</dd>
<dt class='enumerate-enumitem'>
2.
</dt><dd class='enumerate-enumitem'>After the first phase, each time the new value read is associated to <!-- l. 201 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mi>T</mi></mrow><mrow><mn>7</mn></mrow></msub></math></span>
and the window slides in the already indicated way <a href='#scorrimentofinestra'>here (1)</a>.
</dd>
<dt class='enumerate-enumitem'>
3.
</dt><dd class='enumerate-enumitem'>After assigning <!-- l. 202 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mi>W</mi></mrow><mrow><mi>k</mi></mrow></msub></math></span>
to <!-- l. 202 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mi>T</mi></mrow><mrow><mn>7</mn></mrow></msub></math></span>,
three “dummy zeros” are assigned, one at each computation, to <!-- l. 202 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mi>T</mi></mrow><mrow><mn>7</mn></mrow></msub></math></span>
until reaching the computation of <!-- l. 202 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mi>W</mi></mrow><mrow><mi>k</mi></mrow></msub></math></span>.
<a id='zerofillend'></a><a href='#zerofillend'>We will refer to this procedure as (2)</a>.</dd></dl>
<!-- l. 204 --><p class='noindent'>Moreover, we distinguish the following “zones”: </p>
<ul class='itemize1'>
<li class='itemize'>multiplication (in red): to compute each <!-- l. 206 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msub><mrow><mi>T</mi></mrow><mrow><mi>i</mi></mrow></msub> <mo class='MathClass-bin' stretchy='false'>⋅</mo> <msub><mrow><mi>C</mi></mrow><mrow><mi>i</mi></mrow></msub></mrow></math></span>.
Here the zeroing of coefficients <!-- l. 206 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msub><mrow><mi>C</mi></mrow><mrow><mn>1</mn></mrow></msub><mo class='MathClass-punc' stretchy='false'>,</mo><msub><mrow><mi>C</mi></mrow><mrow><mn>7</mn></mrow></msub></mrow></math></span>
occurs in the case of an order-3 filter with a mux whose selection signal is the LSB of <!-- l. 206 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>S</mi></math></span>,
as described earlier.
</li>
<li class='itemize'>Sum (in red) of each <!-- l. 207 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msub><mrow><mi>T</mi></mrow><mrow><mi>i</mi></mrow></msub> <mo class='MathClass-bin' stretchy='false'>⋅</mo> <msub><mrow><mi>C</mi></mrow><mrow><mi>i</mi></mrow></msub></mrow></math></span>,
i.e., <!-- l. 207 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msubsup><mrow><mi class='MathClass-op'>∑</mi><mo> ⁡<!-- FUNCTION APPLICATION --></mo>
  <!-- nolimits --></mrow><mrow><mi>i</mi><mo class='MathClass-rel' stretchy='false'>=</mo><mn>1</mn></mrow><mrow><mn>7</mn></mrow></msubsup><msub><mrow><mi>T</mi></mrow><mrow><mi>i</mi></mrow></msub> <mo class='MathClass-bin' stretchy='false'>⋅</mo> <msub><mrow><mi>C</mi></mrow><mrow><mi>i</mi></mrow></msub></mrow></math></span>.
</li>
<li class='itemize'>Division by the approximated normalized value (in light blue), with possible addition of the <!-- l. 208 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow> <mo class='MathClass-bin' stretchy='false'>+</mo> <mn>1</mn></mrow></math></span>
contribution due to the rounding error introduced by shifting.
</li>
<li class='itemize'>Saturation to <!-- l. 209 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow> <mo class='MathClass-bin' stretchy='false'>+</mo> <mn>127</mn></mrow></math></span>
and <!-- l. 209 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow> <mo class='MathClass-bin' stretchy='false'>−</mo> <mn>128</mn></mrow></math></span>.</li></ul>
<figure class='figure'>
<!-- l. 216 --><p class='noindent' id='schematic-circuit-of-the-filter-computation-part-note-that-the-names-on-registers-ww-should-actually-be-tt-consistently-with-the-distinction-already-explained'><img alt='PIC' src='report/img/pre_project_schematic_filter.jpg' /> <a id='x1-8004r3'></a>
</p>
<figcaption class='caption'><span class='id'>Figure 3:  </span><span class='content'>Schematic  circuit  of  the  filter  computation  part.  Note  that  the  names  on  registers
<!-- l. 217 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msub><mrow><mi>W</mi></mrow><mrow><mn>1</mn></mrow></msub> <mo class='MathClass-bin' stretchy='false'>−</mo> <msub><mrow><mi>W</mi></mrow><mrow><mn>7</mn></mrow></msub></mrow></math></span>
should actually be <!-- l. 217 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msub><mrow><mi>T</mi></mrow><mrow><mn>1</mn></mrow></msub> <mo class='MathClass-bin' stretchy='false'>−</mo> <msub><mrow><mi>T</mi></mrow><mrow><mn>7</mn></mrow></msub></mrow></math></span>,
consistently with the distinction already explained.                                           </span></figcaption><!-- tex4ht:label?: x1-8004r3  -->
</figure>
<!-- l. 221 --><p class='noindent'>The saturator block, whose detailed schematic is in Figure <a href='#schematic-circuit-of-the-saturation-part-in-the-figure-there-is-a-small-error-the-signal-leaving-the-xor-block-is-bits-as-described-above-not-'>4<!-- tex4ht:ref: fig:saturazione  --></a>, takes the 18-bit signal resulting from the previous operations
(hereafter called <!-- l. 221 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>in</mi></mstyle></math></span>)
and returns an 8-bit saturated one, as follows:
</p>
<dl class='enumerate-enumitem'><dt class='enumerate-enumitem'>
1.
</dt><dd class='enumerate-enumitem'>compute <!-- l. 223 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msub><mrow><mi>x</mi></mrow><mrow><mi>i</mi></mrow></msub> <mo class='MathClass-rel' stretchy='false'>=</mo> <mstyle mathvariant='normal'><mi>in</mi></mstyle><mo class='MathClass-open' stretchy='false'>[</mo><mn>7</mn><mo class='MathClass-close' stretchy='false'>]</mo> <mo class='MathClass-bin' stretchy='false'>⊕</mo><mstyle mathvariant='normal'><mi>in</mi></mstyle><mo class='MathClass-open' stretchy='false'>[</mo><mi>i</mi><mo class='MathClass-close' stretchy='false'>]</mo></mrow></math></span>
for <!-- l. 223 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>i</mi> <mo class='MathClass-rel' stretchy='false'>∈</mo><mo class='MathClass-open' stretchy='false'>{</mo><mn>8</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mo>…</mo><mo class='MathClass-punc' stretchy='false'>,</mo><mn>17</mn><mo class='MathClass-close' stretchy='false'>}</mo></mrow></math></span>
(10 2-bit XORs).
</dd>
<dt class='enumerate-enumitem'>
2.
</dt><dd class='enumerate-enumitem'><!-- l. 224 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mstyle mathvariant='normal'><mi>overflow</mi></mstyle> <mo class='MathClass-rel' stretchy='false'>=</mo><msubsup><mrow> <mi class='MathClass-op'>∨</mi><mo> ⁡<!-- FUNCTION APPLICATION --></mo>
  <!-- nolimits --></mrow><mrow><mi>i</mi><mo class='MathClass-rel' stretchy='false'>=</mo><mn>8</mn></mrow><mrow><mn>17</mn></mrow></msubsup><msub><mrow><mi>x</mi></mrow><mrow><mi>i</mi></mrow></msub></mrow></math></span>
(10-bit OR).
</dd>
<dt class='enumerate-enumitem'>
3.
</dt><dd class='enumerate-enumitem'><!-- l. 225 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mstyle mathvariant='normal'><mi>out</mi></mstyle> <mo class='MathClass-rel' stretchy='false'>=</mo> <mrow class='cases'> <mrow><mo fence='true' form='prefix'>{</mo><mrow> <mtable align='axis' class='array' columnlines='none' displaystyle='true' equalcolumns='false' equalrows='false' rowlines='' style=''> <mtr class='array-row'><mtd class='array-td' columnalign='left'><mstyle mathvariant='normal'><mi>unsat</mi></mstyle><mo class='MathClass-punc' stretchy='false'>,</mo><mspace class='quad' width='1em'></mspace></mtd>
        <mtd class='array-td' columnalign='left'><mstyle class='text'><mtext>if </mtext></mstyle><mi class='MathClass-op'>¬</mi><mo> ⁡<!-- FUNCTION APPLICATION --></mo><mspace class='thinspace' width='0.17em'></mspace><mstyle mathvariant='normal'><mi>overflow</mi></mstyle></mtd>
</mtr>  <mtr class='array-row'><mtd class='array-td' columnalign='left'><mstyle mathvariant='normal'><mi>sat</mi></mstyle><mo class='MathClass-punc' stretchy='false'>,</mo>   <mspace class='quad' width='1em'></mspace></mtd><mtd class='array-td' columnalign='left'><mstyle class='text'><mtext>if </mtext></mstyle><mstyle mathvariant='normal'><mi>overflow</mi></mstyle>  </mtd></mtr>
<!-- @{}l@{\quad }l@{} --></mtable>                                                                                                                                   </mrow><mo fence='true' form='postfix'></mo></mrow></mrow></mrow></math></span>
(MUX with selection <!-- l. 228 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>overflow</mi></mstyle></math></span>).
</dd>
<dt class='enumerate-enumitem'>
4.
</dt><dd class='enumerate-enumitem'><!-- l. 229 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mstyle mathvariant='normal'><mi>sat</mi></mstyle> <mo class='MathClass-rel' stretchy='false'>=</mo> <mrow class='cases'> <mrow><mo fence='true' form='prefix'>{</mo><mrow> <mtable align='axis' class='array' columnlines='none' displaystyle='true' equalcolumns='false' equalrows='false' rowlines='' style=''> <mtr class='array-row'><mtd class='array-td' columnalign='left'><mn>127</mn><mo class='MathClass-punc' stretchy='false'>,</mo>  <mspace class='quad' width='1em'></mspace></mtd>
        <mtd class='array-td' columnalign='left'><mstyle class='text'><mtext>if </mtext></mstyle><mstyle mathvariant='normal'><mi>in</mi></mstyle><mo class='MathClass-open' stretchy='false'>[</mo><mn>17</mn><mo class='MathClass-close' stretchy='false'>]</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>0</mn></mtd>
</mtr>  <mtr class='array-row'><mtd class='array-td' columnalign='left'><mo class='MathClass-bin' stretchy='false'>−</mo><mn>128</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mspace class='quad' width='1em'></mspace></mtd><mtd class='array-td' columnalign='left'><mstyle class='text'><mtext>if </mtext></mstyle><mstyle mathvariant='normal'><mi>in</mi></mstyle><mo class='MathClass-open' stretchy='false'>[</mo><mn>17</mn><mo class='MathClass-close' stretchy='false'>]</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>1</mn></mtd></mtr>
<!-- @{}l@{\quad }l@{} --></mtable>                                                                                                                                   </mrow><mo fence='true' form='postfix'></mo></mrow></mrow></mrow></math></span>
(MUX with selection <!-- l. 232 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mstyle mathvariant='normal'><mi>in</mi></mstyle><mo class='MathClass-open' stretchy='false'>[</mo><mn>17</mn><mo class='MathClass-close' stretchy='false'>]</mo></mrow></math></span>).
</dd>
<dt class='enumerate-enumitem'>
5.
</dt><dd class='enumerate-enumitem'><!-- l. 233 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mstyle mathvariant='normal'><mi>unsat</mi></mstyle> <mo class='MathClass-rel' stretchy='false'>=</mo> <mstyle mathvariant='normal'><mi>in</mi></mstyle><mo class='MathClass-open' stretchy='false'>[</mo><mn>7</mn> <mo class='MathClass-punc' stretchy='false'>:</mo> <mn>0</mn><mo class='MathClass-close' stretchy='false'>]</mo></mrow></math></span>
(take bits <!-- l. 233 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>0</mn> <mo class='MathClass-bin' stretchy='false'>−</mo> <mn>7</mn></mrow></math></span>
of the input).</dd></dl>
<figure class='figure'>
<!-- l. 240 --><p class='noindent' id='schematic-circuit-of-the-saturation-part-in-the-figure-there-is-a-small-error-the-signal-leaving-the-xor-block-is-bits-as-described-above-not-'><img alt='PIC' src='report/img/pre_project_schematic_saturatore.jpg' /> <a id='x1-8010r4'></a>
</p>
<figcaption class='caption'><span class='id'>Figure 4: </span><span class='content'>Schematic circuit of the saturation part. In the figure there is a small error: the signal leaving
the XOR block is 10 bits as described above, not 24.                                         </span></figcaption><!-- tex4ht:label?: x1-8010r4  -->
</figure>
<h4 class='subsectionHead' id='code-documentation'><span class='titlemark'>2.2   </span> <a id='x1-90002.2'></a>Code documentation</h4>
<!-- l. 247 --><p class='noindent'>Regarding the FSM, its detailed operation will be described below (Section <a href='#state-machine'>2.3<!-- tex4ht:ref: sec:fsmgrafo  --></a>), but we have three
processes:
</p>
<ul class='itemize1'>
<li class='itemize'>The function <!-- l. 250 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>fsm</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>state</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>reg</mi></mstyle></math></span>,
which implements the register encapsulating the state.
</li>
<li class='itemize'>The function <!-- l. 251 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>δ</mi></math></span>
(<!-- l. 251 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>fsm</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>delta</mi></mstyle></math></span>),
which defines the FSM state transitions.
</li>
<li class='itemize'>The function <!-- l. 252 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>λ</mi></math></span>
(<!-- l. 252 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>fsm</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>lambda</mi></mstyle></math></span>),
which defines the signals we want to be controlled by the FSM, e.g., the enable signals of the
registers and the writing of the new value into <!-- l. 252 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mi>T</mi></mrow><mrow><mn>7</mn></mrow></msub></math></span>
to obtain the new window with which to compute.</li></ul>
<!-- l. 255 --><p class='noindent'>Moreover, we have an additional process <!-- l. 255 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>read</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>t</mi><mn>7</mn></mstyle></math></span>
that implements registers <!-- l. 255 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msub><mrow><mi>T</mi></mrow><mrow><mn>1</mn></mrow></msub><mo class='MathClass-punc' stretchy='false'>,</mo><mi>…</mi><mo class='MathClass-punc' stretchy='false'>,</mo><msub><mrow><mi>T</mi></mrow><mrow><mn>7</mn></mrow></msub></mrow></math></span>
by sliding the window, thus updating them correctly as described previously <a href='#scorrimentofinestra'>(1)</a>.
</p><!-- l. 257 --><p class='noindent'>In dataflow we implemented: </p>
<ul class='itemize1'>
<li class='itemize'><!-- l. 259 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>o</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>done</mi></mstyle></math></span>,
which is set equal to <!-- l. 259 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>i</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>start AND finito</mi></mstyle></math></span>,
where <!-- l. 259 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>finito</mi></mstyle></math></span>
indicates the end of computing the <!-- l. 259 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msup><mrow><mi>f</mi></mrow><mrow><mi>′</mi></mrow></msup><mo class='MathClass-open' stretchy='false'>(</mo><mi>i</mi><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>
values: thus it can be equal to 1 iff I have finished the computation and <!-- l. 259 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>i</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>start</mi></mstyle></math></span>
is still 1.
</li>
<li class='itemize'><!-- l. 260 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>zero</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>fill</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>end</mi></mstyle></math></span>,
which is a signal used to determine when to start filling <!-- l. 260 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mi>T</mi></mrow><mrow><mn>7</mn></mrow></msub></math></span>
with zeros, according to the procedure described in <a href='#zerofillend'>(2)</a>.
</li>
<li class='itemize'><!-- l. 261 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>o</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>mem</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>addr</mi></mstyle></math></span>,
which is chosen between a) <!-- l. 261 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>i</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>data</mi></mstyle></math></span>
+ <!-- l. 261 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>offset</mi></mstyle></math></span>
when in the read phase, b) <!-- l. 261 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>i</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>data</mi></mstyle></math></span>
+ <!-- l. 261 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>offset</mi></mstyle></math></span>
+ <!-- l. 261 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>k</mi></mstyle></math></span>
when in the write phase, “jumping” from the <!-- l. 261 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>W</mi></math></span>
memory cells to the <!-- l. 261 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>R</mi></math></span>
memory cells. The signal that handles the selection is <!-- l. 261 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>temp</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>we</mi></mstyle></math></span>.
</li>
<li class='itemize'><!-- l. 262 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>k</mi></mstyle></math></span>
is obtained by concatenating <!-- l. 262 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>k</mi><mn>1</mn></mstyle></math></span>
and <!-- l. 262 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>k</mi><mn>2</mn></mstyle></math></span>.
</li>
<li class='itemize'>The combinational part computing the filtered value.</li></ul>
<!-- l. 266 --><p class='noindent'>The combinational part is analogous to the one described in Section <a href='#x1-8000doc'>2.1<!-- tex4ht:ref: sec:combinatoria  --></a>, so we do not comment on it in particular,
except noting that it is in dataflow and easily identifiable by a comment in the code. For greater readability and code
simplicity, unlike what was described in Section <a href='#x1-8000doc'>2.1<!-- tex4ht:ref: sec:combinatoria  --></a>, the decision whether to saturate or not is implemented with a
comparison <!-- l. 267 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow> <mo class='MathClass-rel' stretchy='false'>&gt;</mo> <mn>127</mn></mrow></math></span>
and <!-- l. 267 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow> <mo class='MathClass-rel' stretchy='false'>&lt;</mo> <mo class='MathClass-bin' stretchy='false'>−</mo><mn>128</mn></mrow></math></span>
between signed types.
</p>
<h4 class='subsectionHead' id='state-machine'><span class='titlemark'>2.3   </span> <a id='x1-100002.3'></a>State machine</h4>
<!-- l. 271 --><p class='noindent'>The FSM graph is presented. On the edges, the conditions under which the transition occurs are indicated; if
omitted, it is understood that there is no condition, or rather the transition is caused by a new clock cycle. On
each node it is indicated how the FSM acts on the signals it controls, without specifying those it leaves
unchanged.
</p><!-- l. 273 --><p class='noindent'>We can describe it briefly: </p>
<ul class='itemize1'>
<li class='itemize'><!-- l. 275 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>WAIT</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>START</mi></mstyle></math></span>
state: waiting state for the condition that begins computation, which is <!-- l. 275 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mstyle mathvariant='normal'><mi>i</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>start</mi></mstyle> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>1</mn><mi> </mi><mstyle mathvariant='normal'><mi>AND</mi></mstyle><mi> </mi><mstyle mathvariant='normal'><mi>rst</mi></mstyle> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>0</mn></mrow></math></span>.
</li>
<li class='itemize'>States <!-- l. 276 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mstyle mathvariant='normal'><mi>INIT</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>STATE</mi></mstyle> <mo class='MathClass-rel' stretchy='false'>→</mo><mstyle mathvariant='normal'><mi>READ</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>C</mi><mn>7</mn></mstyle></mrow></math></span>:
initialization  states  for  the  registers  storing  the  information  used  during  computation,  i.e.,  all
memory cells from <!-- l. 276 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msub><mrow><mi>K</mi></mrow><mrow><mn>1</mn></mrow></msub><mo class='MathClass-punc' stretchy='false'>,</mo><msub><mrow><mi>K</mi></mrow><mrow><mn>2</mn></mrow></msub><mo class='MathClass-punc' stretchy='false'>,</mo><mi>S</mi><mo class='MathClass-punc' stretchy='false'>,</mo><msub><mrow><mi>C</mi></mrow><mrow><mn>1</mn></mrow></msub><mo class='MathClass-punc' stretchy='false'>,</mo><mi>…</mi><mo class='MathClass-punc' stretchy='false'>,</mo><msub><mrow><mi>C</mi></mrow><mrow><mn>7</mn></mrow></msub></mrow></math></span>.
</li>
<li class='itemize'>States <!-- l. 277 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mstyle mathvariant='normal'><mi>READ</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>W</mi><mn>1</mn></mstyle> <mo class='MathClass-rel' stretchy='false'>→</mo><mstyle mathvariant='normal'><mi>READ</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>W</mi><mn>3</mn></mstyle></mrow></math></span>:
states used to reach the useful configuration (described previously) in order to then perform the
computation of the first <!-- l. 277 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mi>W</mi></mrow><mrow><mn>1</mn></mrow></msub></math></span>.
</li>
<li class='itemize'>States <!-- l. 278 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mstyle mathvariant='normal'><mi>READ</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>W</mi></mstyle> <mo class='MathClass-rel' stretchy='false'>→</mo><mstyle mathvariant='normal'><mi>FILTER</mi></mstyle> <mo class='MathClass-rel' stretchy='false'>→</mo><mstyle mathvariant='normal'><mi>WRITE</mi></mstyle> <mo class='MathClass-rel' stretchy='false'>→</mo><mstyle mathvariant='normal'><mi>READ</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>W</mi></mstyle></mrow></math></span>:
handle subsequent computations, reading the new <!-- l. 278 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>W</mi></math></span>
value into <!-- l. 278 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mi>T</mi></mrow><mrow><mn>7</mn></mrow></msub></math></span>,
then computing (combinationally) the filtered value <!-- l. 278 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msup><mrow><mi>f</mi></mrow><mrow><mi>′</mi></mrow></msup></math></span>,
writing it to memory in the appropriate <!-- l. 278 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>R</mi></math></span>
cell, and then repeating.
</li>
<li class='itemize'><!-- l. 279 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>DONE</mi></mstyle></math></span>
state: state transitioned to after the last computation, where it will wait for <!-- l. 279 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mstyle mathvariant='normal'><mi>i</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>start</mi></mstyle> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>0</mn></mrow></math></span>,
which will bring it back to <!-- l. 279 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>WAIT</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>START</mi></mstyle></math></span>
awaiting a new signal to compute and thus a new <!-- l. 279 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>ADD</mi></mstyle></math></span>
address from which to read the values.</li></ul>
<figure class='figure'>
<!-- l. 284 --><p class='noindent' id='fsm-graph'><img alt='PIC' src='report/img/FSM_graph.drawio.png' /> <a id='x1-10001r5'></a>
</p>
<figcaption class='caption'><span class='id'>Figure 5: </span><span class='content'>FSM graph                                                                  </span></figcaption><!-- tex4ht:label?: x1-10001r5  -->
</figure>
<!-- l. 289 --><p class='noindent'>
</p>
<h3 class='sectionHead' id='experimental-results'><span class='titlemark'>3   </span> <a id='x1-110003'></a>Experimental results</h3>
<h4 class='subsectionHead' id='synthesis'><span class='titlemark'>3.1   </span> <a id='x1-120003.1'></a>Synthesis</h4>
<!-- l. 294 --><p class='noindent'>The project was synthesized with the standard options of Xilinx Vivado 2016.4 on an XC7A200T-FBG484-1 device. A clock constraint
with a period of <!-- l. 294 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>20</mn></mrow></math></span>ns
was defined, while Input/Output delay values were considered ideal. Below, the timing and utilization reports are
included and commented, confirming the correctness of the project and compliance with timing
constraints.
</p>
<h5 class='subsubsectionHead' id='utilization-report'><span class='titlemark'>3.1.1   </span> <a id='x1-130003.1.1'></a>Utilization Report</h5>
<figure class='figure'>
<!-- l. 301 --><p class='noindent' id='vivado-utilization-report-a'><img alt='PIC' src='report/img/utilizzation_1.png' />  <a id='x1-13001r6'></a>
</p>
<figcaption class='caption'><span class='id'>Figure 6: </span><span class='content'>Vivado Utilization Report (a)                                                   </span></figcaption><!-- tex4ht:label?: x1-13001r6  -->
</figure>
<figure class='figure'>
<!-- l. 310 --><p class='noindent' id='vivado-utilization-report-b'><img alt='PIC' src='report/img/utilizzation_2.png' /> <a id='x1-13002r7'></a>
</p>
<figcaption class='caption'><span class='id'>Figure 7: </span><span class='content'>Vivado Utilization Report (b)                                                   </span></figcaption><!-- tex4ht:label?: x1-13002r7  -->
</figure>
<!-- l. 317 --><p class='noindent'>The utilization report highlights that the project uses a very small portion of the resources available on the chosen device. In
particular, <!-- l. 317 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>738</mn></mrow></math></span> Slice LUTs
are used, equal to <!-- l. 317 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>0.55</mn><mi>%</mi></mrow></math></span> of
the total, <!-- l. 317 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mn>1</mn></math></span> 7-input
multiplexer, and <!-- l. 317 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>163</mn></mrow></math></span> registers,
corresponding to <!-- l. 317 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>0.06</mn><mi>%</mi></mrow></math></span>.
All registers are implemented as flip-flops, without generating unwanted latches.
</p><!-- l. 319 --><p class='noindent'>The clock network makes use of a BUFG (a single FPGA clock buffer for the entire project). From the interface perspective,
<!-- l. 319 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>54</mn></mrow></math></span> I/O ports are
used out of <!-- l. 319 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>285</mn></mrow></math></span>
available (<!-- l. 319 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>18</mn><mo class='MathClass-punc' stretchy='false'>.</mo><mn>95</mn><mi>%</mi></mrow></math></span>),
which constitutes the relatively most used resource compared to the others. No RAM blocks nor DSP blocks are
used.
</p><!-- l. 321 --><p class='noindent'>An usage of <!-- l. 321 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>154</mn></mrow></math></span>
CARRY4s (4-bit carry chains) is observed.
</p>
<h5 class='subsubsectionHead' id='timing-report'><span class='titlemark'>3.1.2   </span> <a id='x1-140003.1.2'></a>Timing Report</h5>
<figure class='figure'>
<!-- l. 328 --><p class='noindent' id='vivado-timing-report'><img alt='PIC' src='report/img/report_timing.png' /> <a id='x1-14001r8'></a>
</p>
<figcaption class='caption'><span class='id'>Figure 8: </span><span class='content'>Vivado Timing Report                                                         </span></figcaption><!-- tex4ht:label?: x1-14001r8  -->
</figure>
<!-- l. 335 --><p class='noindent'>The timing report shows that the project fully meets the timing constraints: the <span class='ec-lmsso-10'>slack </span>is positive and equal to
<!-- l. 335 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>13</mn><mo class='MathClass-punc' stretchy='false'>.</mo><mn>521</mn></mrow></math></span>ns with respect
to the <!-- l. 335 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>20</mn></mrow></math></span>ns
clock period. This indicates that the circuit can operate at higher frequencies.
</p><!-- l. 337 --><p class='noindent'>The <span class='ec-lmsso-10'>critical path </span>has a propagation time of <!-- l. 337 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>6.434</mn></mrow></math></span>ns,
split into logic (<!-- l. 337 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>2.990</mn></mrow></math></span>ns,
equal to <!-- l. 337 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>46</mn><mo class='MathClass-punc' stretchy='false'>.</mo><mn>5</mn><mi>%</mi></mrow></math></span>) and
routing (<!-- l. 337 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>3.444</mn></mrow></math></span>ns,
equal to <!-- l. 337 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>53</mn><mo class='MathClass-punc' stretchy='false'>.</mo><mn>5</mn><mi>%</mi></mrow></math></span>),
passing through <!-- l. 337 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mn>8</mn></math></span>
logic levels.
</p>
<h4 class='subsectionHead' id='simulations'><span class='titlemark'>3.2   </span> <a id='x1-150003.2'></a>Simulations</h4>
<!-- l. 341 --><p class='noindent'>We used <!-- l. 341 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mn>5</mn></math></span>
main testbenches, all passed, which we report here. Moreover, we tried all the remaining testbenches on webeep
for safety.
</p>
<h5 class='subsubsectionHead' id='testbench-'><span class='titlemark'>3.2.1   </span> <a id='x1-160003.2.1'></a>Testbench 1 - 4</h5>
<!-- l. 345 --><p class='noindent'>Testbenches <!-- l. 345 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mn>1</mn></math></span>,
<!-- l. 345 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mn>2</mn></math></span>,
<!-- l. 345 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mn>3</mn></math></span>,
<!-- l. 345 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mn>4</mn></math></span> all have
the same structure at the code level: the idea is to test the component by changing only the filter coefficients
<!-- l. 345 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mi>C</mi></mrow><mrow><mi>i</mi></mrow></msub></math></span> and the
coefficients of <!-- l. 345 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>f</mi></math></span>,
<!-- l. 345 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mi>W</mi></mrow><mrow><mi>i</mi></mrow></msub></math></span>. This
was made simple thanks to a site reported on the webeep forum that generated test cases allowing
customization of the given values. In particular, the differences among the various testbenches
are:
</p>
<dl class='enumerate-enumitem'><dt class='enumerate-enumitem'>
1.
</dt><dd class='enumerate-enumitem'><span class='ec-lmssbx-10'>tb2425</span>: testbench provided by the professors.
</dd>
<dt class='enumerate-enumitem'>
2.
</dt><dd class='enumerate-enumitem'><span class='ec-lmssbx-10'>tbAllZero</span>: testbench generated with the site found on the webeep forum, with both filter and
<!-- l. 348 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>f</mi></math></span>
input coefficients equal to zero.
</dd>
<dt class='enumerate-enumitem'>
3.
</dt><dd class='enumerate-enumitem'><span class='ec-lmssbx-10'>tbNonZero</span>: testbench generated with the site found on the webeep forum, with coefficients such
that the output does not saturate and is non-zero.
</dd>
<dt class='enumerate-enumitem'>
4.
</dt><dd class='enumerate-enumitem'><span class='ec-lmssbx-10'>tbAllSat</span>: testbench generated with the site found on the webeep forum, with very large coefficients
so that the output always saturates.</dd></dl>
<!-- l. 353 --><p class='noindent'>We explain here the general structure of all <!-- l. 353 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mn>4</mn></math></span>:
</p>
<ul class='itemize1'>
<li class='itemize'>In the initial <!-- l. 355 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>architecture</mi></mstyle></math></span>,
the clock period is defined, the testbench signals to be connected to the component, and the signals
to be connected to the memory. The memory is defined. A <span class='ec-lmsso-10'>scenario </span>is defined, i.e., all input data for
each computation (already presented), including the starting address <!-- l. 355 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>ADD</mi></mstyle></math></span>.
</li>
<li class='itemize'>The defined signals are mapped to those of the component.
</li>
<li class='itemize'>The clock is actually generated.
</li>
<li class='itemize'><span class='ec-lmssbx-10'>MEM </span>process, which defines the behavior of the memory as per specification, e.g., writing with
<!-- l. 361 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mstyle mathvariant='normal'><mi>o</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>mem</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>we</mi></mstyle> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>1</mn></mrow></math></span>
and <!-- l. 361 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mstyle mathvariant='normal'><mi>o</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>mem</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>en</mi></mstyle> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>1</mn></mrow></math></span>,
reading with <!-- l. 361 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mstyle mathvariant='normal'><mi>o</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>mem</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>we</mi></mstyle> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>0</mn></mrow></math></span>.
</li>
<li class='itemize'><span class='ec-lmssbx-10'>create_scenario </span>process: sets <!-- l. 363 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mstyle mathvariant='normal'><mi>memory</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>control</mi></mstyle> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>0</mn></mrow></math></span>,
initializes the tb signals, including <!-- l. 363 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mstyle mathvariant='normal'><mi>tb</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>rst</mi></mstyle> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>1</mn></mrow></math></span>,
and the <!-- l. 363 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>init</mi></mstyle></math></span>
signals with the previously defined scenario, sets the first address, starts the computation, and then
waits for its termination with <!-- l. 363 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>tb</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>done</mi></mstyle></math></span>.
Finally it resets <!-- l. 363 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mstyle mathvariant='normal'><mi>tb</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>start</mi></mstyle> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>0</mn></mrow></math></span>.
</li>
<li class='itemize'><span class='ec-lmssbx-10'>memory_signal_swapper </span>process: decides whether the RAM is driven by the <!-- l. 365 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>init</mi></mstyle></math></span>
or <!-- l. 365 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>exc</mi></mstyle></math></span>
signals. In practice, initially <!-- l. 365 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mstyle mathvariant='normal'><mi>memory</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>control</mi></mstyle> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>0</mn></mrow></math></span>
and I initialize the memory with the previously defined scenario, then <!-- l. 365 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>memory</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>control</mi></mstyle></math></span>
becomes <!-- l. 365 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mn>1</mn></math></span>
and the memory uses the testbench signals.
</li>
<li class='itemize'><span class='ec-lmssbx-10'>test_routine </span>process: waits for <!-- l. 367 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mstyle mathvariant='normal'><mi>tb</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>rst</mi></mstyle> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>1</mn></mrow></math></span>
(set by <!-- l. 367 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>create</mi><mstyle class='text'><mtext>_</mtext></mstyle><mi>scenario</mi></mstyle></math></span>),
checks that the component resets correctly, waits for the start signal to rise, waits for the done signal
to rise. After the <!-- l. 367 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>done</mi></mstyle></math></span>
signal, it checks that nothing more is written to memory or that it is disabled, and then checks that
all written cells (indicated in the specification as <!-- l. 367 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mi>R</mi></mrow><mrow><mi>i</mi></mrow></msub></math></span>)
correspond to the actual filter solutions. Finally, it checks the correct “alternation” of the <!-- l. 367 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>start</mi></mstyle></math></span>
and <!-- l. 367 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>done</mi></mstyle></math></span>
signals as indicated in the specification and in the slides of the project presentation lecture.</li></ul>
<h5 class='subsubsectionHead' id='testbench-mark'><span class='titlemark'>3.2.2   </span> <a id='x1-170003.2.2'></a>Testbench 5: Mark2</h5>
<!-- l. 372 --><p class='noindent'>From a code standpoint, there are no particular constructs or syntax and it is analogous to the previous
tbs.
</p><!-- l. 374 --><p class='noindent'>The fundamental differences are: </p>
<ul class='itemize1'>
<li class='itemize'>It tests that the component resets correctly if it receives a “random” reset while processing a
computation. In particular, this is tested with multiple resets during the tb.
</li>
<li class='itemize'>It tests that the component can start a new processing when it has correctly concluded the previous
one; therefore multiple different scenarios are defined.
</li>
<li class='itemize'>It tests computations with a very large <!-- l. 378 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>K</mi></math></span>
signal (obtained by concatenating <!-- l. 378 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>K</mi><mn>1</mn></mrow></math></span>
and <!-- l. 378 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>K</mi><mn>2</mn></mrow></math></span>),
and therefore many <!-- l. 378 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>W</mi></math></span>
words as input and many <!-- l. 378 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>R</mi></math></span>
words to write.</li></ul>
<h3 class='sectionHead' id='conclusions'><span class='titlemark'>4   </span> <a id='x1-180004'></a>Conclusions</h3>
<!-- l. 383 --><p class='noindent'>In this project, the typical phases of designing a digital component were addressed: understanding the
specification, architectural description/design, VHDL implementation, and finally verification through simulation
and synthesis.
</p><!-- l. 385 --><p class='noindent'>In the initial phase, the mathematical characteristics of the filter were analyzed, highlighting its nature and the
implications on implementation choices.
</p><!-- l. 387 --><p class='noindent'>Subsequently, a modular architecture was designed, with an FSM supporting control and a combinational part
(datapath) dedicated to filter computation and saturation handling.
</p><!-- l. 389 --><p class='noindent'>The synthesis results also demonstrated minimal use of hardware resources and a large margin with respect to
the imposed timing constraints, indicating that the project can operate at higher clock frequencies without
critical issues.
</p><!-- l. 391 --><p class='noindent'>Simulations with different testbenches, which included corner cases both on the combinational part (such as null
inputs and constant saturation) and on the state machine (such as using reset during a computation and not
only at the beginning), confirmed the correctness of the solution.
</p><!-- l. 393 --><p class='noindent'>The attached documentation, with schematics, commented code, and results analysis, reflects the design choices
and the adopted methodology.
</p>
</div>
