# Markov Chain Monte Carlo for the $N^2$-queens problem

[GitHub repository](https://github.com/renonesopocaj/3d-queens-mcmc)

<!-- COMPLETE ORIGINAL REPORT -->
<div class="report report-3d-queens-mcmc">
<div class='maketitle'>
<h2 class='titleHead'>Solving the 3D
<!-- l. 38 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msup><mi>N</mi><mn>2</mn></msup></math></span>
Queens Problem<br />
via Markov Chain Monte Carlo</h2>
          <div class='author'><span class='ecrm-1200'>Chengheng Li Chen, Francisco Badia Laguillo, Jacopo Senoner</span>
<br />                <span class='ecti-1200'>School of Computer and Communication Sciences</span>
<br />                          <span class='ecti-1200'>EPFL, Lausanne, Switzerland</span>
<br /> <span class='ectt-1200'>{chengheng.lichen, francisco.badialaguillo, jacopo.senoner}@epfl.ch</span></div><br />
<div class='date'></div>
</div>
<section class='abstract' role='doc-abstract'>
<h3 class='abstracttitle'><span class='ecbx-0900'>Abstract</span></h3>
<!-- l. 40 --><p class='noindent'>
    <span class='ecrm-0900'>The classical </span><!-- l. 41 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>N</mi></math></span><span class='ecrm-0900'>-queens
    problem            admits            a            natural
    three-dimensional       generalization:       placing</span>
    <!-- l. 41 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msup><mrow><mi>N</mi></mrow><mrow><mn>2</mn></mrow></msup></math></span>
    <span class='ecrm-0900'>mutually     non-attacking     queens     on     an</span>
    <!-- l. 41 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-bin' stretchy='false'>×</mo><mi>N</mi> <mo class='MathClass-bin' stretchy='false'>×</mo><mi>N</mi></mrow></math></span>
    <span class='ecrm-0900'>cubic  board,  where  queens  attack  along  rook
    lines,   planar   diagonals,   and   space   diagonals.
    We   formulate   this   as   energy   minimization
    and   develop   a   Metropolis-Hastings   algorithm
    with  simulated  annealing,  proving  correctness
    by     establishing     irreducibility,     aperiodicity,
    and     weak     reversibility.     Experiments     for</span>
    <!-- l. 41 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>3</mn></mrow></math></span>
    <span class='ecrm-0900'>to </span><!-- l. 41 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>11</mn></mrow></math></span>
    <span class='ecrm-0900'>confirm  theoretical  predictions:  instances  with</span>
    <!-- l. 41 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi class='qopname'> gcd</mi><mo> ⁡<!-- FUNCTION APPLICATION --> </mo><mo class='MathClass-open' stretchy='false'>(</mo><mi>N</mi><mo class='MathClass-punc' stretchy='false'>,</mo><mn>210</mn><mo class='MathClass-close' stretchy='false'>)</mo> <mo class='MathClass-rel' stretchy='false'>&gt;</mo> <mn>1</mn></mrow></math></span>
    <span class='ecrm-0900'>converge      to      positive      energy,      while</span>
    <!-- l. 41 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>11</mn></mrow></math></span>
    <span class='ecrm-0900'>reaches   zero-energy   configurations.   We   find
    that   only   the   linear   energy   transformation
    reliably attains global minima, and that constant
    high-</span><!-- l. 41 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>β</mi></math></span>
    <span class='ecrm-0900'>schedules          suffice          for          moderate</span>
    <!-- l. 41 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>N</mi></math></span><span class='ecrm-0900'>,
    suggesting  a  benign  energy  landscape  at  these
    problem sizes.</span>
</p>
</section>
<h3 class='sectionHead' id='introduction'><span class='titlemark'>1   </span> <a id='x1-10001'></a>Introduction</h3>
<!-- l. 45 --><p class='noindent'>The classical <!-- l. 45 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>N</mi></math></span>-queens
problem asks to place <!-- l. 45 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>N</mi></math></span>
queens on an <!-- l. 45 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-bin' stretchy='false'>×</mo> <mi>N</mi></mrow></math></span>chessboard such that no two queens attack each other. This
 work studies a natural three-dimensional generalization: placing
 <!-- l. 45 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msup><mrow><mi>N</mi></mrow><mrow><mn>2</mn></mrow></msup></math></span> queens
 on an <!-- l. 45 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-bin' stretchy='false'>×</mo> <mi>N</mi> <mo class='MathClass-bin' stretchy='false'>×</mo> <mi>N</mi></mrow></math></span>
 cubic board without mutual attacks.
 </p><!-- l. 47 --><p class='noindent'>The transition to three dimensions introduces additional attack
 directions and a substantially larger configuration space,
 rendering exhaustive enumeration infeasible for moderate values
 of <!-- l. 47 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>N</mi></math></span>.
 We therefore adopt a Markov Chain Monte Carlo (MCMC)
 approach, constructing a Markov chain whose stationary
 distribution concentrates on low-energy configurations.
 </p><!-- l. 49 --><p class='noindent'>The remainder of this report is organized as follows.
 Section <a href='#problem-formulation'>2<!-- tex4ht:ref: sec:formulation  --></a> formalizes the problem by introducing the attack
 relations, state space, and energy function, addressing the
 first two questions of the mini-project description. Section <a href='#mcmc-algorithm'>3<!-- tex4ht:ref: sec:mcmc  --></a>
 develops the MCMC algorithm and discusses the design of
 the proposal distribution, addressing the remaining question
 of Section 2. Section <a href='#experimental-results'>4<!-- tex4ht:ref: sec:experiments  --></a> presents experimental results, with
 each subsection corresponding to a question from the
 mini-project description. Section <a href='#conclusion'>5<!-- tex4ht:ref: sec:conclusion  --></a> offers concluding
 remarks.
 </p>
 <h3 class='sectionHead' id='problem-formulation'><span class='titlemark'>2   </span> <a id='x1-20002'></a>Problem Formulation</h3>
 <!-- l. 52 --><p class='noindent'>We begin by establishing the mathematical framework for
 the three-dimensional queens problem.
 </p>
 <h4 class='subsectionHead' id='board-and-positions'><span class='titlemark'>2.1   </span> <a id='x1-30002.1'></a>Board and Positions</h4>
 <div class='newtheorem'>
 <!-- l. 55 --><p class='noindent'><span class='head'>
<a id='x1-3001r1'></a>
<span class='ecbx-1000'>Definition 2.1 </span>(Board)<span class='ecbx-1000'>.</span>  </span>The <span class='ecti-1000'>board </span>is the discrete cube
<!-- l. 56 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msub><mrow><mstyle mathvariant='script'><mi>B</mi></mstyle></mrow><mrow><mi>N</mi></mrow></msub> <mo class='MathClass-rel' stretchy='false'>=</mo> <msup><mrow><mo class='MathClass-open' stretchy='false'>{</mo><mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>1</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mo>…</mo><mo class='MathClass-punc' stretchy='false'>,</mo><mi>N</mi> <mo class='MathClass-bin' stretchy='false'>−</mo> <mn>1</mn><mo class='MathClass-close' stretchy='false'>}</mo></mrow><mrow><mn>3</mn></mrow></msup></mrow></math></span>.
Each element <!-- l. 56 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mi>i</mi><mo class='MathClass-punc' stretchy='false'>,</mo><mi>j</mi><mo class='MathClass-punc' stretchy='false'>,</mo><mi>k</mi><mo class='MathClass-close' stretchy='false'>)</mo> <mo class='MathClass-rel' stretchy='false'>∈</mo><msub><mrow><mstyle mathvariant='script'><mi>B</mi></mstyle></mrow><mrow><mi>N</mi></mrow></msub></mrow></math></span>
represents             a             <span class='ecti-1000'>position</span>,             where
<!-- l. 56 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>i</mi></math></span>,
<!-- l. 56 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>j</mi></math></span>,
and <!-- l. 56 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>k</mi></math></span>
denote coordinates along the three orthogonal axes.
</p>
</div>
<!-- l. 57 --><p class='noindent'> For instance, when <!-- l. 58 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>4</mn></mrow></math></span>,
the board contains <!-- l. 58 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msup><mrow><mn>4</mn></mrow><mrow><mn>3</mn></mrow></msup> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>64</mn></mrow></math></span>
positions, and we seek to place
<!-- l. 58 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msup><mrow><mn>4</mn></mrow><mrow><mn>2</mn></mrow></msup> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>16</mn></mrow></math></span>
queens.
</p>
<h4 class='subsectionHead' id='attack-relations'><span class='titlemark'>2.2   </span> <a id='x1-40002.2'></a>Attack Relations</h4>
<!-- l. 61 --><p class='noindent'>In three dimensions, queens attack along more directions
than in the classical planar setting. We identify three
distinct types of attack, each generalizing a familiar
movement pattern from two-dimensional chess.
</p>
<div class='newtheorem'>
<!-- l. 63 --><p class='noindent'><span class='head'>
<a id='x1-4001r2'></a>
<span class='ecbx-1000'>Definition 2.2 </span>(Attack Relation)<span class='ecbx-1000'>.</span>  </span> Two distinct positions
<!-- l. 64 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mi>i</mi><mo class='MathClass-punc' stretchy='false'>,</mo><mi>j</mi><mo class='MathClass-punc' stretchy='false'>,</mo><mi>k</mi><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span> and
<!-- l. 64 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>(</mo><msup><mrow><mi>i</mi></mrow><mrow><mi>′</mi></mrow></msup><mo class='MathClass-punc' stretchy='false'>,</mo><msup><mrow><mi>j</mi></mrow><mrow><mi>′</mi></mrow></msup><mo class='MathClass-punc' stretchy='false'>,</mo><msup><mrow><mi>k</mi></mrow><mrow><mi>′</mi></mrow></msup><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span> are
said to be <span class='ecti-1000'>in attack </span>if any of the following conditions holds:
</p>
  <ul class='itemize1'>
  <li class='itemize'><span class='ecbx-1000'>Rook-type attack: </span>The positions share at least two
  coordinates.  Equivalently,  they  have  the  same  pair
  <!-- l. 66 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mi>i</mi><mo class='MathClass-punc' stretchy='false'>,</mo><mi>j</mi><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>,
  the same pair <!-- l. 66 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mi>i</mi><mo class='MathClass-punc' stretchy='false'>,</mo><mi>k</mi><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>,
  or the same pair <!-- l. 66 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mi>j</mi><mo class='MathClass-punc' stretchy='false'>,</mo><mi>k</mi><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>.
  </li>
  <li class='itemize'><span class='ecbx-1000'>Planar     diagonal     attack:    </span>The     positions
  lie     on     a     common     diagonal     within     one
  of    the    three    coordinate    planes.    In    the
  <!-- l. 67 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi mathvariant='italic'>𝑥𝑦</mi></mrow></math></span>-plane
  (when <!-- l. 67 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>k</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <msup><mrow><mi>k</mi></mrow><mrow><mi>′</mi></mrow></msup></mrow></math></span>),
  this occurs when <!-- l. 67 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-rel' stretchy='false'>|</mo><mi>i</mi> <mo class='MathClass-bin' stretchy='false'>−</mo> <msup><mrow><mi>i</mi></mrow><mrow><mi>′</mi></mrow></msup><mo class='MathClass-rel' stretchy='false'>|</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <mo class='MathClass-rel' stretchy='false'>|</mo><mi>j</mi> <mo class='MathClass-bin' stretchy='false'>−</mo> <msup><mrow><mi>j</mi></mrow><mrow><mi>′</mi></mrow></msup><mo class='MathClass-rel' stretchy='false'>|</mo><mo class='MathClass-rel' stretchy='false'>≠</mo><mn>0</mn></mrow></math></span>.
  Analogous       conditions       apply       to       the
  <!-- l. 67 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi mathvariant='italic'>𝑥𝑧</mi></mrow></math></span>-plane
  and the <!-- l. 67 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi mathvariant='italic'>𝑦𝑧</mi></mrow></math></span>-plane.</li>
   <li class='itemize'><span class='ecbx-1000'>Space   diagonal   attack:  </span>All   three   coordinate
   differences     have     equal     nonzero     magnitude:
   <!-- l. 68 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-rel' stretchy='false'>|</mo><mi>i</mi> <mo class='MathClass-bin' stretchy='false'>−</mo> <msup><mrow><mi>i</mi></mrow><mrow><mi>′</mi></mrow></msup><mo class='MathClass-rel' stretchy='false'>|</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <mo class='MathClass-rel' stretchy='false'>|</mo><mi>j</mi> <mo class='MathClass-bin' stretchy='false'>−</mo> <msup><mrow><mi>j</mi></mrow><mrow><mi>′</mi></mrow></msup><mo class='MathClass-rel' stretchy='false'>|</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <mo class='MathClass-rel' stretchy='false'>|</mo><mi>k</mi> <mo class='MathClass-bin' stretchy='false'>−</mo> <msup><mrow><mi>k</mi></mrow><mrow><mi>′</mi></mrow></msup><mo class='MathClass-rel' stretchy='false'>|</mo><mo class='MathClass-rel' stretchy='false'>≠</mo><mn>0</mn></mrow></math></span>.</li></ul>
 </div>
 <!-- l. 70 --><p class='noindent'> The rook-type and planar diagonal attacks generalize the
 movement of the “classical” chess queen to each axis-aligned
 plane. The space diagonal condition introduces the four
 families of diagonals that traverse the interior of the cube, a
 feature unique to three dimensions.
 </p>
 <div class='newtheorem'>
 <!-- l. 73 --><p class='noindent'><span class='head'>
 <a id='x1-4002r1'></a>
<span class='ecbx-1000'>Example 2.1 </span>(Central Queen)<span class='ecbx-1000'>.</span>  </span>On                        a
 <!-- l. 74 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>3</mn> <mo class='MathClass-bin' stretchy='false'>×</mo> <mn>3</mn> <mo class='MathClass-bin' stretchy='false'>×</mo> <mn>3</mn></mrow></math></span>
 board, a queen at <!-- l. 74 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mn>1</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>1</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>1</mn><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>
 attacks <!-- l. 74 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>0</mn><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>
 and <!-- l. 74 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mn>2</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>2</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>2</mn><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>
 via space diagonals, <!-- l. 74 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>1</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>1</mn><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>
 and <!-- l. 74 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mn>2</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>1</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>1</mn><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>
 via rook-type (shared <!-- l. 74 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>j</mi><mo class='MathClass-punc' stretchy='false'>,</mo><mi>k</mi></mrow></math></span>),
 and <!-- l. 74 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>1</mn><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>
 and <!-- l. 74 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mn>2</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>2</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>1</mn><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>
 via          planar          diagonals          in          the
 <!-- l. 74 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>k</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>1</mn></mrow></math></span>
 plane.
 </p>
 </div>
 <!-- l. 75 --><p class='noindent'>
 </p>
 <div class='newtheorem'>
 <!-- l. 77 --><p class='noindent'><span class='head'>
 <a id='x1-4003r2'></a>
<span class='ecbx-1000'>Example 2.2 </span>(Non-Attacking Pair)<span class='ecbx-1000'>.</span>  </span>Queens          at
 <!-- l. 78 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>0</mn><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>
 and
 <!-- l. 78 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mn>2</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>1</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>3</mn><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>
 do   not   attack:   no   two   coordinates   match   (not
 rook-type),               coordinate               differences
 <!-- l. 78 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>2</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>1</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>3</mn></mrow></math></span>
 are pairwise distinct (not planar), and not all equal (not
 space diagonal).
 </p>
 </div>
 <!-- l. 79 --><p class='noindent'>
 </p>
<h4 class='subsectionHead' id='state-space'><span class='titlemark'>2.3   </span> <a id='x1-50002.3'></a>State Space</h4>
<!-- l. 82 --><p class='noindent'>We now define how configurations of queens are represented.
Since queens are indistinguishable, two arrangements
occupying the same set of positions are considered
identical.
</p>
<div class='newtheorem'>
<!-- l. 84 --><p class='noindent'><span class='head'>
<a id='x1-5001r3'></a>
<span class='ecbx-1000'>Definition 2.3 </span>(Configuration and State Space)<span class='ecbx-1000'>.</span>  </span>A <span class='ecti-1000'>configuration</span>
is a set <!-- l. 85 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>s</mi> <mo class='MathClass-rel' stretchy='false'>⊂</mo><msub><mrow><mstyle mathvariant='script'><mi>B</mi></mstyle></mrow><mrow><mi>N</mi></mrow></msub></mrow></math></span>
of <!-- l. 85 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msup><mrow><mi>N</mi></mrow><mrow><mn>2</mn></mrow></msup></math></span>
distinct positions. The <span class='ecti-1000'>state space </span>is </p><table class='equation-star'><tr><td>
<!-- l. 86 --><math class='equation' display='block' xmlns='http://www.w3.org/1998/Math/MathML'><mrow>
            <mstyle mathvariant='script'><mi>𝒮</mi></mstyle> <mo class='MathClass-rel' stretchy='false'>=</mo><mrow><mo class='MathClass-open' fence='true' mathsize='1.19em'>{</mo><mrow><mi>s</mi> <mo class='MathClass-rel' stretchy='false'>⊂</mo><msub><mrow><mstyle mathvariant='script'><mi>B</mi></mstyle></mrow><mrow><mi>N</mi></mrow></msub> <mo class='MathClass-punc' stretchy='false'>:</mo> <mo class='MathClass-rel' stretchy='false'>|</mo><mi>s</mi><mo class='MathClass-rel' stretchy='false'>|</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <msup><mrow><mi>N</mi></mrow><mrow><mn>2</mn></mrow></msup></mrow><mo class='MathClass-close' fence='true' mathsize='1.19em'>}</mo></mrow><mo class='MathClass-punc' stretchy='false'>,</mo>
</mrow></math></td></tr></table>
<!-- l. 89 --><p class='noindent'>with cardinality <!-- l. 89 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-rel' stretchy='false'>|</mo><mstyle mathvariant='script'><mi>𝒮</mi></mstyle><mo class='MathClass-rel' stretchy='false'>|</mo> <mo class='MathClass-rel' stretchy='false'>=</mo><mrow><mo fence='true' form='prefix'>(</mo><mfrac linethickness='0.0pt'><mrow> <msup><mrow><mi>N</mi></mrow><mrow><mn>3</mn></mrow></msup></mrow>
<mrow><msup><mrow><mi>N</mi></mrow><mrow><mn>2</mn></mrow></msup></mrow></mfrac><mo fence='true' form='postfix'>)</mo></mrow> </mrow></math></span>.
</p>
</div>
<!-- l. 90 --><p class='noindent'> This general formulation admits any arrangement of
<!-- l. 91 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msup><mrow><mi>N</mi></mrow><mrow><mn>2</mn></mrow></msup></math></span> queens on the
board. For <!-- l. 91 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>3</mn></mrow></math></span>, we have
<!-- l. 91 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-rel' stretchy='false'>|</mo><mstyle mathvariant='script'><mi>𝒮</mi></mstyle><mo class='MathClass-rel' stretchy='false'>|</mo> <mo class='MathClass-rel' stretchy='false'>=</mo><mrow><mo fence='true' form='prefix'>(</mo><mfrac linethickness='0.0pt'><mrow> <mn>27</mn></mrow>
 <mrow><mn>9</mn></mrow></mfrac><mo fence='true' form='postfix'>)</mo></mrow>  <mo class='MathClass-rel' stretchy='false'>≈</mo> <mn>4.7</mn> <mo class='MathClass-bin' stretchy='false'>×</mo> <mn>1</mn><msup><mrow><mn>0</mn></mrow><mrow><mn>6</mn></mrow></msup></mrow></math></span> configurations,
and for <!-- l. 91 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>4</mn></mrow></math></span>, this
grows to <!-- l. 91 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-rel' stretchy='false'>|</mo><mstyle mathvariant='script'><mi>𝒮</mi></mstyle><mo class='MathClass-rel' stretchy='false'>|</mo><mo class='MathClass-rel' stretchy='false'>≈</mo> <mn>4.9</mn> <mo class='MathClass-bin' stretchy='false'>×</mo> <mn>1</mn><msup><mrow><mn>0</mn></mrow><mrow><mn>13</mn></mrow></msup></mrow></math></span>,
rendering exhaustive search infeasible.
</p>
<h5 class='subsubsectionHead' id='possible-state-space-reductions'><span class='titlemark'>2.3.1   </span> <a id='x1-60002.3.1'></a>Possible State Space Reductions</h5>
<!-- l. 94 --><p class='noindent'>Several approaches can reduce the effective size of the state
space.
</p><!-- l. 96 --><p class='noindent'><span class='ecbx-1000'>Restricted configurations. </span>Rather than
representing a configuration as an arbitrary set of
<!-- l. 96 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msup><mrow><mi>N</mi></mrow><mrow><mn>2</mn></mrow></msup></math></span>
positions, one can encode it as a function
<!-- l. 96 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>κ</mi> <mo class='MathClass-punc' stretchy='false'>:</mo> <msup><mrow><mo class='MathClass-open' stretchy='false'>{</mo><mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mo>…</mo><mo class='MathClass-punc' stretchy='false'>,</mo><mi>N</mi> <mo class='MathClass-bin' stretchy='false'>−</mo> <mn>1</mn><mo class='MathClass-close' stretchy='false'>}</mo></mrow><mrow><mn>2</mn></mrow></msup> <mo class='MathClass-rel' stretchy='false'>→</mo><mo class='MathClass-open' stretchy='false'>{</mo><mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mo>…</mo><mo class='MathClass-punc' stretchy='false'>,</mo><mi>N</mi> <mo class='MathClass-bin' stretchy='false'>−</mo> <mn>1</mn><mo class='MathClass-close' stretchy='false'>}</mo></mrow></math></span>,
placing exactly one queen at position
<!-- l. 96 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mi>i</mi><mo class='MathClass-punc' stretchy='false'>,</mo><mi>j</mi><mo class='MathClass-punc' stretchy='false'>,</mo><mi>κ</mi><mo class='MathClass-open' stretchy='false'>(</mo><mi>i</mi><mo class='MathClass-punc' stretchy='false'>,</mo><mi>j</mi><mo class='MathClass-close' stretchy='false'>)</mo><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span> for each
pair <!-- l. 96 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mi>i</mi><mo class='MathClass-punc' stretchy='false'>,</mo><mi>j</mi><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>.
Geometrically, this places one queen per vertical line parallel to
the <!-- l. 96 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>k</mi></math></span>-axis.
The restricted state space has cardinality              <!-- l. 96 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msup><mrow><mi>N</mi></mrow><mrow><msup><mrow><mi>N</mi></mrow><mrow><mn>2</mn></mrow></msup>
     </mrow></msup></math></span>, substantially
  smaller than <!-- l. 96 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mrow><mo fence='true' form='prefix'>(</mo><mfrac linethickness='0.0pt'><mrow><msup><mrow><mi>N</mi></mrow><mrow><mn>3</mn></mrow></msup></mrow>
<mrow><msup><mrow><mi>N</mi></mrow><mrow><mn>2</mn></mrow></msup></mrow></mfrac><mo fence='true' form='postfix'>)</mo></mrow> </mrow></math></span>.
  Moreover, rook-type attacks along the
  <!-- l. 96 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>k</mi></math></span>-axis are
  eliminated by construction, since no two queens can share the
  same <!-- l. 96 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mi>i</mi><mo class='MathClass-punc' stretchy='false'>,</mo><mi>j</mi><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>
 coordinates. Importantly, this restriction preserves all zero-energy
  solutions: any valid solution must have exactly one queen
  per <!-- l. 96 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mi>i</mi><mo class='MathClass-punc' stretchy='false'>,</mo><mi>j</mi><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>
 pair, as having two would create a rook-type attack.
  </p><!-- l. 98 --><p class='noindent'><span class='ecbx-1000'>Symmetry reduction. </span>The cubic board
  <!-- l. 98 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mstyle mathvariant='script'><mi>B</mi></mstyle></mrow><mrow><mi>N</mi></mrow></msub></math></span>
  admits geometric symmetries including rotations and
  reflections. These symmetries partition the state space into
  equivalence classes, and one could in principle explore only
  one representative per class. However, this approach is not
  effective for MCMC: all configurations in the same
  equivalence class share the same energy, so the algorithm
  already treats them equivalently. Furthermore, computing
  the canonical representative of an equivalence class is
  computationally costly, adding overhead without improving
  convergence.
  </p><!-- l. 100 --><p class='noindent'>For simplicity of implementation, we adopted the general state
  space <!-- l. 100 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='script'><mi>𝒮</mi></mstyle></math></span>
 without these reductions in our experiments. The MCMC
  algorithm remains correct on the full space, and the moderate
  values of <!-- l. 100 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>N</mi></math></span>
 considered did not require additional optimizations.
  </p>
  <h4 class='subsectionHead' id='energy-function'><span class='titlemark'>2.4   </span> <a id='x1-70002.4'></a>Energy Function</h4>
  <!-- l. 103 --><p class='noindent'>The energy function quantifies the degree of conflict in a
  configuration. A valid solution, in which no two queens
  attack each other, corresponds to zero energy.
  </p>
  <div class='newtheorem'>
  <!-- l. 105 --><p class='noindent'><span class='head'>
  <a id='x1-7001r4'></a>
<span class='ecbx-1000'>Definition 2.4 </span>(Energy Function)<span class='ecbx-1000'>.</span>   </span> The <span class='ecti-1000'>energy </span>of a configuration
  <!-- l. 106 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>s</mi> <mo class='MathClass-rel' stretchy='false'>∈</mo><mstyle mathvariant='script'><mi>𝒮</mi></mstyle></mrow></math></span> is
  the number of attacking pairs: </p><table class='equation'><tr><td>
  <!-- l. 107 --><p class='noindent'>
</p><!-- l. 107 --><math class='equation' display='block' xmlns='http://www.w3.org/1998/Math/MathML'><mrow>
        <mstyle class='label' id='x1-7002r1'></mstyle><!-- endlabel --><mi>J</mi><mo class='MathClass-open' stretchy='false'>(</mo><mi>s</mi><mo class='MathClass-close' stretchy='false'>)</mo> <mo class='MathClass-punc' stretchy='false'>:</mo><mo class='MathClass-rel' stretchy='false'>=</mo><munder class='msub'><mrow><mo> ∑</mo>
   </mrow><mrow><mo class='MathClass-open' stretchy='false'>{</mo><mi>q</mi><mo class='MathClass-punc' stretchy='false'>,</mo><msup><mrow><mi>q</mi></mrow><mrow><mi>′</mi></mrow></msup><mo class='MathClass-close' stretchy='false'>}</mo><mo class='MathClass-rel' stretchy='false'>⊆</mo><mi>s</mi></mrow></munder><mstyle mathvariant='bold'><mn>1</mn></mstyle><mrow><mo class='MathClass-open' fence='true' mathsize='1.19em'>[</mo><mrow><mi>q</mi><mstyle class='text'><mtext> attacks </mtext></mstyle><msup><mrow><mi>q</mi></mrow><mrow><mi>′</mi></mrow></msup></mrow><mo class='MathClass-close' fence='true' mathsize='1.19em'>]</mo></mrow><mo class='MathClass-punc' stretchy='false'>.</mo>
</mrow></math></td><td class='eq-no'>(1)</td></tr></table>
<!-- l. 109 --><p class='noindent'>
</p>
</div>
<!-- l. 110 --><p class='noindent'> The energy counts unordered pairs of mutually attacking
queens, rather than the number of endangered queens. Each
attacking pair is counted exactly once, even if the two queens
attack each other along multiple directions simultaneously.
Thus <!-- l. 111 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>J</mi><mo class='MathClass-open' stretchy='false'>(</mo><mi>s</mi><mo class='MathClass-close' stretchy='false'>)</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>0</mn></mrow></math></span>
if and only if no attacks exist.
</p><!-- l. 113 --><p class='noindent'>Second, the function <!-- l. 113 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>g</mi></math></span>
offers flexibility in shaping the energy landscape: </p>
  <ul class='itemize1'>
  <li class='itemize'><!-- l. 115 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>g</mi><mo class='MathClass-open' stretchy='false'>(</mo><mi>x</mi><mo class='MathClass-close' stretchy='false'>)</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <mi>x</mi></mrow></math></span>:
  directly counts attacking pairs (our choice).
  </li>
  <li class='itemize'><!-- l. 116 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>g</mi><mo class='MathClass-open' stretchy='false'>(</mo><mi>x</mi><mo class='MathClass-close' stretchy='false'>)</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <msup><mrow><mi>x</mi></mrow><mrow><mn>2</mn></mrow></msup></mrow></math></span>:
  penalizes high-conflict states more heavily.
  </li>
  <li class='itemize'><!-- l. 117 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>g</mi><mo class='MathClass-open' stretchy='false'>(</mo><mi>x</mi><mo class='MathClass-close' stretchy='false'>)</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <mi class='loglike'>log</mi><mo>⁡<!-- FUNCTION APPLICATION --></mo><!-- nolimits --><mo class='MathClass-open' stretchy='false'>(</mo><mn>1</mn> <mo class='MathClass-bin' stretchy='false'>+</mo> <mi>x</mi><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>:
  compresses large values.</li></ul>
<div class='newtheorem'>
<!-- l. 120 --><p class='noindent'><span class='head'>
<a id='x1-7003r3'></a>
<span class='ecbx-1000'>Example 2.3 </span>(Energy Calculation)<span class='ecbx-1000'>.</span>  </span>For
<!-- l. 121 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>2</mn></mrow></math></span>,
consider               four               queens               at
<!-- l. 121 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>0</mn><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>,
<!-- l. 121 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>1</mn><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>,
<!-- l. 121 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mn>1</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>1</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>0</mn><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>,
<!-- l. 121 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mn>1</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>1</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>1</mn><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>.
The pairs <!-- l. 121 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>{</mo><mo class='MathClass-open' stretchy='false'>(</mo><mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>0</mn><mo class='MathClass-close' stretchy='false'>)</mo><mo class='MathClass-punc' stretchy='false'>,</mo><mo class='MathClass-open' stretchy='false'>(</mo><mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>1</mn><mo class='MathClass-close' stretchy='false'>)</mo><mo class='MathClass-close' stretchy='false'>}</mo></mrow></math></span>
and <!-- l. 121 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>{</mo><mo class='MathClass-open' stretchy='false'>(</mo><mn>1</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>1</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>0</mn><mo class='MathClass-close' stretchy='false'>)</mo><mo class='MathClass-punc' stretchy='false'>,</mo><mo class='MathClass-open' stretchy='false'>(</mo><mn>1</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>1</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>1</mn><mo class='MathClass-close' stretchy='false'>)</mo><mo class='MathClass-close' stretchy='false'>}</mo></mrow></math></span>
each  share  two  coordinates  (rook-type  attacks),  so
<!-- l. 121 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>J</mi><mo class='MathClass-open' stretchy='false'>(</mo><mi>s</mi><mo class='MathClass-close' stretchy='false'>)</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>2</mn></mrow></math></span>.
</p>
</div>
<!-- l. 122 --><p class='noindent'>
</p>
<h5 class='subsubsectionHead' id='energy-computation'><span class='titlemark'>2.4.1   </span> <a id='x1-80002.4.1'></a>Energy Computation</h5>                         <!-- l. 125 --><p class='noindent'>A direct approach to computing
  <!-- l. 125 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>J</mi><mo class='MathClass-open' stretchy='false'>(</mo><mi>s</mi><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span> examines
  all <!-- l. 125 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mrow><mo fence='true' form='prefix'>(</mo><mfrac linethickness='0.0pt'><mrow><msup><mrow><mi>N</mi></mrow><mrow><mn>2</mn></mrow></msup></mrow>
 <mrow><mn>2</mn></mrow></mfrac><mo fence='true' form='postfix'>)</mo></mrow>  </mrow></math></span>
  pairs of queens and checks whether each pair satisfies any of
  the attack conditions in Definition <a href='#x1-4001r2'>2.2<!-- tex4ht:ref: def:attack  --></a>. This yields
  <!-- l. 125 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mstyle mathvariant='script'><mi>𝒪</mi></mstyle><mo class='MathClass-open' stretchy='false'>(</mo><msup><mrow><mi>N</mi></mrow><mrow><mn>4</mn></mrow></msup><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>
 complexity.
  </p>
  <div class='algorithm'>
<!-- l. 127 --><p class='noindent'></p><figure class='float' id='x1-8001r1'><span id='direct-energy-computation'></span>
<figcaption class='caption'><span class='id'><span class='ecbx-1000'>Algorithm 1 </span></span><span class='content'>Direct Energy Computation
</span></figcaption><!-- tex4ht:label?: x1-8001r1  -->
<div class='algorithmic'>
       <span class='label-11.99704pt'>
<span class='ecbx-1000'>Require:</span> </span> <span class='algorithmic'> Configuration    <!-- l. 130 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>s</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mo class='MathClass-open' stretchy='false'>{</mo><msub><mrow><mi>q</mi></mrow><mrow><mn>0</mn></mrow></msub><mo class='MathClass-punc' stretchy='false'>,</mo><mo>…</mo><mo class='MathClass-punc' stretchy='false'>,</mo><msub><mrow><mi>q</mi></mrow><mrow><msup><mrow><mi>N</mi></mrow><mrow><mn>2</mn></mrow></msup><mo class='MathClass-bin' stretchy='false'>−</mo><mn>1</mn></mrow></msub><mo class='MathClass-close' stretchy='false'>}</mo></mrow></math></span>        </span><br class='algorithmic' /><span class='label-11.99704pt'> <span class='ecbx-1000'>Ensure:</span> </span> <span class='algorithmic'> Energy <!-- l. 131 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>J</mi><mo class='MathClass-open' stretchy='false'>(</mo><mi>s</mi><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>        </span><br class='algorithmic' /><span class='label-11.99704pt'>  <span class='ecrm-0800'>1:</span> </span> <span class='algorithmic'> <!-- l. 132 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mstyle mathvariant='normal'><mi>count</mi></mstyle> <mo class='MathClass-rel' stretchy='false'>←</mo> <mn>0</mn></mrow></math></span>        </span><br class='algorithmic' /><span class='label-11.99704pt'>  <span class='ecrm-0800'>2:</span> </span> <span class='algorithmic'> <span class='ecbx-1000'>for</span> <!-- l. 133 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>i</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>0</mn></mrow></math></span>    to <!-- l. 133 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msup><mrow><mi>N</mi></mrow><mrow><mn>2</mn></mrow></msup> <mo class='MathClass-bin' stretchy='false'>−</mo> <mn>1</mn></mrow></math></span> <span class='ecbx-1000'>do</span>        </span><br class='algorithmic' /><span class='label-11.99704pt'>  <span class='ecrm-0800'>3:</span> </span> <span class='algorithmic'>      <span class='ecbx-1000'>for</span> <!-- l. 134 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>j</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mi>i</mi> <mo class='MathClass-bin' stretchy='false'>+</mo> <mn>1</mn></mrow></math></span>    to <!-- l. 134 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msup><mrow><mi>N</mi></mrow><mrow><mn>2</mn></mrow></msup> <mo class='MathClass-bin' stretchy='false'>−</mo> <mn>1</mn></mrow></math></span> <span class='ecbx-1000'>do</span>        </span><br class='algorithmic' /><span class='label-11.99704pt'>  <span class='ecrm-0800'>4:</span> </span> <span class='algorithmic'>          <span class='ecbx-1000'>if</span> <span class='eccc1000-'><span class='small-caps'>CheckAttack</span></span>(<!-- l. 135 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msub><mrow><mi>q</mi></mrow><mrow><mi>i</mi></mrow></msub><mo class='MathClass-punc' stretchy='false'>,</mo><msub><mrow><mi>q</mi></mrow><mrow><mi>j</mi></mrow></msub></mrow></math></span>) <span class='ecbx-1000'>then</span>        </span><br class='algorithmic' /><span class='label-11.99704pt'>  <span class='ecrm-0800'>5:</span> </span> <span class='algorithmic'>               <!-- l. 136 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mstyle mathvariant='normal'><mi>count</mi></mstyle> <mo class='MathClass-rel' stretchy='false'>←</mo><mstyle mathvariant='normal'><mi>count</mi></mstyle> <mo class='MathClass-bin' stretchy='false'>+</mo> <mn>1</mn></mrow></math></span>        </span><br class='algorithmic' /><span class='label-11.99704pt'>  <span class='ecrm-0800'>6:</span> </span> <span class='algorithmic'>          <span class='ecbx-1000'>end</span> <span class='ecbx-1000'>if</span>        </span><br class='algorithmic' /><span class='label-11.99704pt'>  <span class='ecrm-0800'>7:</span> </span> <span class='algorithmic'>      <span class='ecbx-1000'>end</span> <span class='ecbx-1000'>for</span>        </span><br class='algorithmic' /><span class='label-11.99704pt'>  <span class='ecrm-0800'>8:</span> </span> <span class='algorithmic'> <span class='ecbx-1000'>end</span> <span class='ecbx-1000'>for</span>        </span><br class='algorithmic' /><span class='label-11.99704pt'>  <span class='ecrm-0800'>9:</span> </span> <span class='algorithmic'> <span class='ecbx-1000'>return </span><!-- l. 140 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='normal'><mi>count</mi></mstyle></math></span></span>
</div>
</figure>
</div>
<div class='newtheorem'>
<!-- l. 144 --><p class='noindent'><span class='head'>
<a id='x1-8002r1'></a>
<span class='ecti-1000'>Remark </span>2.1 (Attack Check)<span class='ecti-1000'>.</span>  </span>The                  function
<span class='eccc1000-'><span class='small-caps'>CheckAttack</span></span><!-- l. 145 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mi>q</mi><mo class='MathClass-punc' stretchy='false'>,</mo><msup><mrow><mi>q</mi></mrow><mrow><mi>′</mi></mrow></msup><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>
returns               true               if               positions
<!-- l. 145 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>q</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mo class='MathClass-open' stretchy='false'>(</mo><mi>i</mi><mo class='MathClass-punc' stretchy='false'>,</mo><mi>j</mi><mo class='MathClass-punc' stretchy='false'>,</mo><mi>k</mi><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>
and <!-- l. 145 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msup><mrow><mi>q</mi></mrow><mrow><mi>′</mi></mrow></msup> <mo class='MathClass-rel' stretchy='false'>=</mo> <mo class='MathClass-open' stretchy='false'>(</mo><msup><mrow><mi>i</mi></mrow><mrow><mi>′</mi></mrow></msup><mo class='MathClass-punc' stretchy='false'>,</mo><msup><mrow><mi>j</mi></mrow><mrow><mi>′</mi></mrow></msup><mo class='MathClass-punc' stretchy='false'>,</mo><msup><mrow><mi>k</mi></mrow><mrow><mi>′</mi></mrow></msup><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>
satisfy      any      attack      condition:       rook-type
(sharing     two     coordinates),     planar     diagonal
(<!-- l. 145 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-rel' stretchy='false'>|</mo><mi>i</mi> <mo class='MathClass-bin' stretchy='false'>−</mo> <msup><mrow><mi>i</mi></mrow><mrow><mi>′</mi></mrow></msup><mo class='MathClass-rel' stretchy='false'>|</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <mo class='MathClass-rel' stretchy='false'>|</mo><mi>j</mi> <mo class='MathClass-bin' stretchy='false'>−</mo> <msup><mrow><mi>j</mi></mrow><mrow><mi>′</mi></mrow></msup><mo class='MathClass-rel' stretchy='false'>|</mo></mrow></math></span>
with <!-- l. 145 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>k</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <msup><mrow><mi>k</mi></mrow><mrow><mi>′</mi></mrow></msup></mrow></math></span>,
or  analogously  for  other  planes),  or  space  diagonal
(<!-- l. 145 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-rel' stretchy='false'>|</mo><mi>i</mi> <mo class='MathClass-bin' stretchy='false'>−</mo> <msup><mrow><mi>i</mi></mrow><mrow><mi>′</mi></mrow></msup><mo class='MathClass-rel' stretchy='false'>|</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <mo class='MathClass-rel' stretchy='false'>|</mo><mi>j</mi> <mo class='MathClass-bin' stretchy='false'>−</mo> <msup><mrow><mi>j</mi></mrow><mrow><mi>′</mi></mrow></msup><mo class='MathClass-rel' stretchy='false'>|</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <mo class='MathClass-rel' stretchy='false'>|</mo><mi>k</mi> <mo class='MathClass-bin' stretchy='false'>−</mo> <msup><mrow><mi>k</mi></mrow><mrow><mi>′</mi></mrow></msup><mo class='MathClass-rel' stretchy='false'>|</mo><mo class='MathClass-rel' stretchy='false'>≠</mo><mn>0</mn></mrow></math></span>).
Each check requires <!-- l. 145 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mstyle mathvariant='script'><mi>𝒪</mi></mstyle><mo class='MathClass-open' stretchy='false'>(</mo><mn>1</mn><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>
time.
</p>
</div>
<!-- l. 146 --><p class='noindent'>
</p><!-- l. 148 --><p class='noindent'>Note that two queens may attack each other through
multiple attack types simultaneously. For instance, queens
at <!-- l. 148 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>0</mn><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>
and <!-- l. 148 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mn>1</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>1</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>0</mn><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>
attack via both rook-type (shared
<!-- l. 148 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>k</mi></math></span>) and planar
diagonal (in the <!-- l. 148 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>k</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>0</mn></mrow></math></span>
plane). However, this pair contributes only one conflict to
the energy, as we count attacking pairs rather than attack
relationships.
</p>
<div class='newtheorem'>
<!-- l. 150 --><p class='noindent'><span class='head'>
<a id='x1-8003r2'></a>
<span class='ecti-1000'>Remark </span>2.2 (Incremental Updates)<span class='ecti-1000'>.</span>  </span>When
a      single      queen      moves      from      position
<!-- l. 151 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>q</mi></math></span>
to position <!-- l. 151 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msup><mrow><mi>q</mi></mrow><mrow><mi>′</mi></mrow></msup></math></span>,
the energy change <!-- l. 151 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi mathvariant='normal'>Δ</mi><mi>J</mi></mrow></math></span>
can be computed in <!-- l. 151 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mstyle mathvariant='script'><mi>𝒪</mi></mstyle><mo class='MathClass-open' stretchy='false'>(</mo><msup><mrow><mi>N</mi></mrow><mrow><mn>2</mn></mrow></msup><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>
time   by   checking   the   moved   queen   against   all
<!-- l. 151 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msup><mrow><mi>N</mi></mrow><mrow><mn>2</mn></mrow></msup> <mo class='MathClass-bin' stretchy='false'>−</mo> <mn>1</mn></mrow></math></span>
other queens.
</p>
</div>
<!-- l. 152 --><p class='noindent'>
</p><!-- l. 154 --><p class='noindent'>An alternative approach maintains counts of queens
on each of the 13 attack line families, enabling
<!-- l. 154 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mstyle mathvariant='script'><mi>𝒪</mi></mstyle><mo class='MathClass-open' stretchy='false'>(</mo><mn>1</mn><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>
incremental updates. However, this method counts attack
relationships rather than attacking pairs, overcounting whentwo queens attack via multiple lines. For the moderate values
 of <!-- l. 154 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>N</mi></math></span>
 in our experiments, the direct algorithm provided sufficient
 performance, and we adopted it for simplicity and
 correctness.
 </p>
 <h3 class='sectionHead' id='mcmc-algorithm'><span class='titlemark'>3   </span> <a id='x1-90003'></a>MCMC Algorithm</h3>
 <!-- l. 157 --><p class='noindent'>We cast the search for a zero-energy configuration as a
 sampling problem. The Metropolis-Hastings algorithm
 generates a Markov chain whose stationary distribution
 concentrates probability on low-energy states. By gradually
 lowering the temperature, the chain is guided toward
 configurations of minimal energy.
 </p>
 <h4 class='subsectionHead' id='proposal-base-chain'><span class='titlemark'>3.1   </span> <a id='x1-100003.1'></a>Proposal Base Chain</h4>
 <!-- l. 160 --><p class='noindent'>The proposal base chain defines how candidate moves are generated.
 Let <!-- l. 160 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi mathvariant='normal'>Ψ</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mo class='MathClass-open' stretchy='false'>(</mo><msub><mrow><mi>ψ</mi></mrow><mrow><mi>s</mi><msup><mrow><mi>s</mi></mrow><mrow><mi>′</mi></mrow></msup></mrow></msub><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>
 denote its transition matrix. For the Metropolis-Hastings
 algorithm to converge to the correct stationary
 distribution, the proposal chain must be irreducible
 (any configuration reachable from any other), aperiodic
 (no deterministic cycling), and weakly reversible
 (<!-- l. 160 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msub><mrow><mi>ψ</mi></mrow><mrow><mi>s</mi><msup><mrow><mi>s</mi></mrow><mrow><mi>′</mi></mrow></msup></mrow></msub> <mo class='MathClass-rel' stretchy='false'>&gt;</mo> <mn>0</mn></mrow></math></span> if and
 only if <!-- l. 160 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msub><mrow><mi>ψ</mi></mrow><mrow><msup><mrow><mi>s</mi></mrow><mrow><mi>′</mi></mrow></msup><mi>s</mi></mrow></msub> <mo class='MathClass-rel' stretchy='false'>&gt;</mo> <mn>0</mn></mrow></math></span>).
 The last condition ensures that the Metropolis-Hastings
 chain satisfies detailed balance with respect to the target
 distribution.
 </p><!-- l. 162 --><p class='noindent'>We adopt a single-queen move that satisfies all three
 conditions.
 </p>
 <div class='newtheorem'>
 <!-- l. 164 --><p class='noindent'><span class='head'>
 <a id='x1-10001r1'></a>
<span class='ecbx-1000'>Definition 3.1 </span>(Move Proposal)<span class='ecbx-1000'>.</span>  </span>Given                  a
 configuration <!-- l. 165 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>s</mi> <mo class='MathClass-rel' stretchy='false'>∈</mo><mstyle mathvariant='script'><mi>𝒮</mi></mstyle></mrow></math></span>,
 a new configuration <!-- l. 165 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msup><mrow><mi>s</mi></mrow><mrow><mi>′</mi></mrow></msup></math></span>
 is       proposed       by       selecting       a       queen
 <!-- l. 165 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>q</mi> <mo class='MathClass-rel' stretchy='false'>∈</mo> <mi>s</mi></mrow></math></span>
 uniformly   at   random,   selecting   an   empty   cell
 <!-- l. 165 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msup><mrow><mi>q</mi></mrow><mrow><mi>′</mi></mrow></msup><mo class='MathClass-rel' stretchy='false'>∈</mo><msub><mrow><mstyle mathvariant='script'><mi>B</mi></mstyle></mrow><mrow><mi>N</mi></mrow></msub> <mo class='MathClass-bin' stretchy='false'>∖</mo> <mi>s</mi></mrow></math></span>
 uniformly        at        random,        and        defining
 <!-- l. 165 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msup><mrow><mi>s</mi></mrow><mrow><mi>′</mi></mrow></msup> <mo class='MathClass-punc' stretchy='false'>:</mo><mo class='MathClass-rel' stretchy='false'>=</mo> <mo class='MathClass-open' stretchy='false'>(</mo><mi>s</mi> <mo class='MathClass-bin' stretchy='false'>∖</mo><mo class='MathClass-open' stretchy='false'>{</mo><mi>q</mi><mo class='MathClass-close' stretchy='false'>}</mo><mo class='MathClass-close' stretchy='false'>)</mo> <mo class='MathClass-bin' stretchy='false'>∪</mo><mo class='MathClass-open' stretchy='false'>{</mo><msup><mrow><mi>q</mi></mrow><mrow><mi>′</mi></mrow></msup><mo class='MathClass-close' stretchy='false'>}</mo></mrow></math></span>.
 </p>
 </div>
 <!-- l. 166 --><p class='noindent'> The proposal probability from
 <!-- l. 167 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>s</mi></math></span> to
 <!-- l. 167 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msup><mrow><mi>s</mi></mrow><mrow><mi>′</mi></mrow></msup></math></span> is
<!-- l. 167 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msub><mrow><mi>ψ</mi></mrow><mrow><mi>s</mi><msup><mrow><mi>s</mi></mrow><mrow><mi>′</mi></mrow></msup></mrow></msub> <mo class='MathClass-rel' stretchy='false'>=</mo>  <mfrac><mrow><mn>1</mn></mrow>
<mrow><msup><mrow><mi>N</mi></mrow><mrow><mn>2</mn></mrow></msup></mrow></mfrac> <mo class='MathClass-bin' stretchy='false'>⋅</mo>  <mfrac><mrow><mn>1</mn></mrow>
<mrow><msup><mrow><mi>N</mi></mrow><mrow><mn>3</mn></mrow></msup><mo class='MathClass-bin' stretchy='false'>−</mo><msup><mrow><mi>N</mi></mrow><mrow><mn>2</mn></mrow></msup></mrow></mfrac> </mrow></math></span>, since we select
uniformly among <!-- l. 167 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msup><mrow><mi>N</mi></mrow><mrow><mn>2</mn></mrow></msup></math></span>
queens and <!-- l. 167 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msup><mrow><mi>N</mi></mrow><mrow><mn>3</mn></mrow></msup> <mo class='MathClass-bin' stretchy='false'>−</mo> <msup><mrow><mi>N</mi></mrow><mrow><mn>2</mn></mrow></msup></mrow></math></span>
empty cells.
</p>
<div class='newtheorem'>
<!-- l. 169 --><p class='noindent'><span class='head'>
<a id='x1-10002r1'></a>
<span class='ecbx-1000'>Proposition 3.1 </span>(Correctness of the Proposal Chain)<span class='ecbx-1000'>.</span>
</span>The        proposal        chain        is        irreducible,
aperiodic,        and        weakly        reversible        on
<!-- l. 170 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='script'><mi>𝒮</mi></mstyle></math></span>.
</p>
</div>
<!-- l. 171 --><p class='noindent'>
</p>
<div class='proof'>
<!-- l. 173 --><p class='noindent'><span class='head'>
<span class='ecti-1000'>Proof.</span> </span>For irreducibility, observe that any configuration
<!-- l. 173 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>s</mi></math></span>
can   be   transformed   into   any   other   configuration
<!-- l. 173 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msup><mrow><mi>s</mi></mrow><mrow><mi>′</mi></mrow></msup></math></span>
through     a     finite     sequence     of     single-queen
moves:       we       relocate       each       queen       in
<!-- l. 173 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>s</mi> <mo class='MathClass-bin' stretchy='false'>∖</mo> <msup><mrow><mi>s</mi></mrow><mrow><mi>′</mi></mrow></msup></mrow></math></span>
to      a      temporary      position,      then      move
queens       to       their       target       positions       in
<!-- l. 173 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msup><mrow><mi>s</mi></mrow><mrow><mi>′</mi></mrow></msup><mo class='MathClass-bin' stretchy='false'>∖</mo> <mi>s</mi></mrow></math></span>.
Since <!-- l. 173 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-rel' stretchy='false'>|</mo><mi>s</mi><mo class='MathClass-rel' stretchy='false'>|</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <mo class='MathClass-rel' stretchy='false'>|</mo><msup><mrow><mi>s</mi></mrow><mrow><mi>′</mi></mrow></msup><mo class='MathClass-rel' stretchy='false'>|</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <msup><mrow><mi>N</mi></mrow><mrow><mn>2</mn></mrow></msup></mrow></math></span>
and  each  move  has  positive  probability,  any  two
configurations communicate.
</p><!-- l. 175 --><p class='noindent'>For aperiodicity, note that proposed moves are accepted
with probability less than one when the energy increases,
creating self-loops that prevent deterministic cycling.
</p><!-- l. 177 --><p class='noindent'>For            weak            reversibility,            suppose
<!-- l. 177 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>s</mi></math></span>
and <!-- l. 177 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msup><mrow><mi>s</mi></mrow><mrow><mi>′</mi></mrow></msup></math></span>
differ               by               moving               queen
<!-- l. 177 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>q</mi></math></span>
to position <!-- l. 177 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msup><mrow><mi>q</mi></mrow><mrow><mi>′</mi></mrow></msup></math></span>,
so that <!-- l. 177 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msup><mrow><mi>s</mi></mrow><mrow><mi>′</mi></mrow></msup> <mo class='MathClass-rel' stretchy='false'>=</mo> <mo class='MathClass-open' stretchy='false'>(</mo><mi>s</mi> <mo class='MathClass-bin' stretchy='false'>∖</mo><mo class='MathClass-open' stretchy='false'>{</mo><mi>q</mi><mo class='MathClass-close' stretchy='false'>}</mo><mo class='MathClass-close' stretchy='false'>)</mo> <mo class='MathClass-bin' stretchy='false'>∪</mo><mo class='MathClass-open' stretchy='false'>{</mo><msup><mrow><mi>q</mi></mrow><mrow><mi>′</mi></mrow></msup><mo class='MathClass-close' stretchy='false'>}</mo></mrow></math></span>.
Then <!-- l. 177 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msub><mrow><mi>ψ</mi></mrow><mrow><mi>s</mi><msup><mrow><mi>s</mi></mrow><mrow><mi>′</mi></mrow></msup></mrow></msub> <mo class='MathClass-rel' stretchy='false'>&gt;</mo> <mn>0</mn></mrow></math></span>
since <!-- l. 177 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>q</mi> <mo class='MathClass-rel' stretchy='false'>∈</mo> <mi>s</mi></mrow></math></span>
and <!-- l. 177 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msup><mrow><mi>q</mi></mrow><mrow><mi>′</mi></mrow></msup><mo class='MathClass-rel' stretchy='false'>∉</mo><mi>s</mi></mrow></math></span>.
Symmetrically, <!-- l. 177 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msub><mrow><mi>ψ</mi></mrow><mrow><msup><mrow><mi>s</mi></mrow><mrow><mi>′</mi></mrow></msup><mi>s</mi></mrow></msub> <mo class='MathClass-rel' stretchy='false'>&gt;</mo> <mn>0</mn></mrow></math></span>
since <!-- l. 177 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msup><mrow><mi>q</mi></mrow><mrow><mi>′</mi></mrow></msup><mo class='MathClass-rel' stretchy='false'>∈</mo> <msup><mrow><mi>s</mi></mrow><mrow><mi>′</mi></mrow></msup></mrow></math></span>
and <!-- l. 177 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>q</mi><mo class='MathClass-rel' stretchy='false'>∉</mo><msup><mrow><mi>s</mi></mrow><mrow><mi>′</mi></mrow></msup></mrow></math></span>.
Thus <!-- l. 177 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msub><mrow><mi>ψ</mi></mrow><mrow><mi>s</mi><msup><mrow><mi>s</mi></mrow><mrow><mi>′</mi></mrow></msup></mrow></msub> <mo class='MathClass-rel' stretchy='false'>&gt;</mo> <mn>0</mn></mrow></math></span>
if and only if <!-- l. 177 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msub><mrow><mi>ψ</mi></mrow><mrow><msup><mrow><mi>s</mi></mrow><mrow><mi>′</mi></mrow></msup><mi>s</mi></mrow></msub> <mo class='MathClass-rel' stretchy='false'>&gt;</mo> <mn>0</mn></mrow></math></span>.
                                             □
</p>                                                 </div>
  <div class='newtheorem'>
  <!-- l. 180 --><p class='noindent'><span class='head'>
  <a id='x1-10003r1'></a>
<span class='ecbx-1000'>Example 3.1 </span>(Move Proposal)<span class='ecbx-1000'>.</span>   </span>For
  <!-- l. 181 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>3</mn></mrow></math></span>
 with a configuration <!-- l. 181 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>s</mi></math></span>
 containing      9      queens      including      one      at
  <!-- l. 181 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>0</mn><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>,
  suppose we select <!-- l. 181 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>q</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mo class='MathClass-open' stretchy='false'>(</mo><mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>0</mn><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>
 and empty cell <!-- l. 181 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msup><mrow><mi>q</mi></mrow><mrow><mi>′</mi></mrow></msup> <mo class='MathClass-rel' stretchy='false'>=</mo> <mo class='MathClass-open' stretchy='false'>(</mo><mn>2</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>1</mn><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>.
  The            proposed            configuration            is
  <!-- l. 181 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msup><mrow><mi>s</mi></mrow><mrow><mi>′</mi></mrow></msup> <mo class='MathClass-rel' stretchy='false'>=</mo> <mo class='MathClass-open' stretchy='false'>(</mo><mi>s</mi> <mo class='MathClass-bin' stretchy='false'>∖</mo><mo class='MathClass-open' stretchy='false'>{</mo><mo class='MathClass-open' stretchy='false'>(</mo><mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>0</mn><mo class='MathClass-close' stretchy='false'>)</mo><mo class='MathClass-close' stretchy='false'>}</mo><mo class='MathClass-close' stretchy='false'>)</mo> <mo class='MathClass-bin' stretchy='false'>∪</mo><mo class='MathClass-open' stretchy='false'>{</mo><mo class='MathClass-open' stretchy='false'>(</mo><mn>2</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>1</mn><mo class='MathClass-close' stretchy='false'>)</mo><mo class='MathClass-close' stretchy='false'>}</mo></mrow></math></span>.
  </p>
  </div>
  <!-- l. 182 --><p class='noindent'>
  </p>
  <div class='newtheorem'>
  <!-- l. 184 --><p class='noindent'><span class='head'>
  <a id='x1-10004r1'></a>
<span class='ecti-1000'>Remark </span>3.1 (Choice of Move Size)<span class='ecti-1000'>.</span>
 </span>Allowing   multiple   queens   to   move   simultaneously
  would increase connectivity but make transitions more
  random, reducing the effectiveness of gradual cooling. A
  single-queen move balances local refinement with global
  exploration when combined with simulated annealing.
  </p>
  </div>
  <!-- l. 186 --><p class='noindent'>
  </p>
  <h4 class='subsectionHead' id='metropolishastings-acceptance'><span class='titlemark'>3.2   </span> <a id='x1-110003.2'></a>Metropolis-Hastings Acceptance</h4>
  <!-- l. 189 --><p class='noindent'>Given a proposal from configuration
  <!-- l. 189 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>s</mi></math></span> to
  <!-- l. 189 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msup><mrow><mi>s</mi></mrow><mrow><mi>′</mi></mrow></msup></math></span>, the
  Metropolis-Hastings algorithm accepts or rejects the move
  according to a probability that depends on the energy
  difference. This mechanism ensures that the chain satisfies
  detailed balance and converges to the desired stationary
  distribution.
  </p>
  <div class='newtheorem'>
  <!-- l. 191 --><p class='noindent'><span class='head'>
  <a id='x1-11001r2'></a>
<span class='ecbx-1000'>Definition 3.2 </span>(Acceptance Probability)<span class='ecbx-1000'>.</span>   </span>The
  acceptance probability for a proposed move from
  <!-- l. 192 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>s</mi></math></span> to
<!-- l. 192 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msup><mrow><mi>s</mi></mrow><mrow><mi>′</mi></mrow></msup></math></span> is
</p><table class='equation'><tr><td>
<!-- l. 193 --><p class='noindent'>
</p><!-- l. 193 --><math class='equation' display='block' xmlns='http://www.w3.org/1998/Math/MathML'><mrow>
<mstyle class='label' id='x1-11002r2'></mstyle><!-- endlabel --><msub><mrow><mi>a</mi></mrow><mrow><mi>s</mi><msup><mrow><mi>s</mi></mrow><mrow><mi>′</mi></mrow></msup></mrow></msub> <mo class='MathClass-punc' stretchy='false'>:</mo><mo class='MathClass-rel' stretchy='false'>=</mo> <mrow class='cases'> <mrow><mo fence='true' form='prefix'>{</mo><mrow> <mtable align='axis' class='array' columnlines='none' displaystyle='true' equalcolumns='false' equalrows='false' rowlines='' style=''> <mtr class='array-row'><mtd class='array-td' columnalign='left'><mi class='qopname'>min</mi><mo> ⁡<!-- FUNCTION APPLICATION --> </mo><mrow><mo class='MathClass-open' fence='true' mathsize='1.19em'>(</mo><mrow><mn>1</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mstyle class='qopname'><mi class='loglike'>exp</mi><mo>⁡<!-- FUNCTION APPLICATION --></mo></mstyle><mo> ⁡<!-- FUNCTION APPLICATION --> </mo><!-- nolimits --><mo class='MathClass-open' stretchy='false'>(</mo><mo class='MathClass-bin' stretchy='false'>−</mo><mi>β</mi><mi mathvariant='normal'>Δ</mi><mi>J</mi><mo class='MathClass-close' stretchy='false'>)</mo></mrow><mo class='MathClass-close' fence='true' mathsize='1.19em'>)</mo></mrow><mspace class='quad' width='1em'></mspace></mtd><mtd class='array-td' columnalign='left'><mstyle class='text'><mtext>if </mtext></mstyle><msub><mrow><mi>ψ</mi></mrow><mrow><mi>s</mi><msup><mrow><mi>s</mi></mrow><mrow><mi>′</mi></mrow></msup></mrow></msub> <mo class='MathClass-rel' stretchy='false'>&gt;</mo> <mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo></mtd>
</mtr>  <mtr class='array-row'><mtd class='array-td' columnalign='left'><mn>0</mn>                          <mspace class='quad' width='1em'></mspace></mtd><mtd class='array-td' columnalign='left'><mstyle class='text'><mtext>otherwise</mtext></mstyle><mo class='MathClass-punc' stretchy='false'>,</mo> </mtd></mtr>
<!-- @{}l@{\quad }l@{} --></mtable>                                                              </mrow><mo fence='true' form='postfix'></mo></mrow></mrow>
</mrow></math></td><td class='eq-no'>(2)</td></tr></table>
<!-- l. 198 --><p class='noindent'>where <!-- l. 199 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi mathvariant='normal'>Δ</mi><mi>J</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mi>J</mi><mo class='MathClass-open' stretchy='false'>(</mo><msup><mrow><mi>s</mi></mrow><mrow><mi>′</mi></mrow></msup><mo class='MathClass-close' stretchy='false'>)</mo> <mo class='MathClass-bin' stretchy='false'>−</mo> <mi>J</mi><mo class='MathClass-open' stretchy='false'>(</mo><mi>s</mi><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>
denotes the energy difference and
<!-- l. 199 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>β</mi> <mo class='MathClass-rel' stretchy='false'>≥</mo> <mn>0</mn></mrow></math></span> is
the inverse temperature parameter.
</p>
</div>
<!-- l. 200 --><p class='noindent'> When <!-- l. 201 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi mathvariant='normal'>Δ</mi><mi>J</mi> <mo class='MathClass-rel' stretchy='false'>≤</mo> <mn>0</mn></mrow></math></span>,
the proposed configuration has equal or lower
energy, and the move is always accepted. When
<!-- l. 201 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi mathvariant='normal'>Δ</mi><mi>J</mi> <mo class='MathClass-rel' stretchy='false'>&gt;</mo> <mn>0</mn></mrow></math></span>, the
move increases energy and is accepted with probability
<!-- l. 201 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow> <mi class='loglike'>exp</mi><mo>⁡<!-- FUNCTION APPLICATION --></mo><!-- nolimits --><mo class='MathClass-open' stretchy='false'>(</mo><mo class='MathClass-bin' stretchy='false'>−</mo><mi>β</mi><mi mathvariant='normal'>Δ</mi><mi>J</mi><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>, which
decreases as <!-- l. 201 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>β</mi></math></span>
increases. This allows occasional uphill moves that help the
chain escape local minima, with the frequency of such
moves controlled by the temperature.
</p>
<div class='newtheorem'>
<!-- l. 203 --><p class='noindent'><span class='head'>
<a id='x1-11003r2'></a>
<span class='ecbx-1000'>Example 3.2 </span>(Acceptance Decision)<span class='ecbx-1000'>.</span>  </span>Suppose
<!-- l. 204 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>β</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>2</mn></mrow></math></span>,
<!-- l. 204 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>J</mi><mo class='MathClass-open' stretchy='false'>(</mo><mi>s</mi><mo class='MathClass-close' stretchy='false'>)</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>5</mn></mrow></math></span>,
and <!-- l. 204 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>J</mi><mo class='MathClass-open' stretchy='false'>(</mo><msup><mrow><mi>s</mi></mrow><mrow><mi>′</mi></mrow></msup><mo class='MathClass-close' stretchy='false'>)</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>7</mn></mrow></math></span>,
so <!-- l. 204 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi mathvariant='normal'>Δ</mi><mi>J</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>2</mn></mrow></math></span>.
The            acceptance            probability            is
<!-- l. 204 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msub><mrow><mi>a</mi></mrow><mrow><mi>s</mi><msup><mrow><mi>s</mi></mrow><mrow><mi>′</mi></mrow></msup></mrow></msub> <mo class='MathClass-rel' stretchy='false'>=</mo> <mi class='loglike'>exp</mi><mo>⁡<!-- FUNCTION APPLICATION --></mo><!-- nolimits --><mo class='MathClass-open' stretchy='false'>(</mo><mo class='MathClass-bin' stretchy='false'>−</mo><mn>2</mn> <mo class='MathClass-bin' stretchy='false'>⋅</mo> <mn>2</mn><mo class='MathClass-close' stretchy='false'>)</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <msup><mrow><mi>e</mi></mrow><mrow><mo class='MathClass-bin' stretchy='false'>−</mo><mn>4</mn></mrow></msup> <mo class='MathClass-rel' stretchy='false'>≈</mo> <mn>0.018</mn></mrow></math></span>.
Despite increasing energy, the move has a small chance
of  acceptance,  allowing  the  chain  to  explore  beyond
local minima.
</p>
</div>
<!-- l. 205 --><p class='noindent'>
</p>
<h4 class='subsectionHead' id='simulated-annealing'><span class='titlemark'>3.3   </span> <a id='x1-120003.3'></a>Simulated Annealing</h4>                           <!-- l. 208 --><p class='noindent'>Rather than fixing <!-- l. 208 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>β</mi></math></span>
 throughout the simulation, we allow it to vary over time
  according to a predefined schedule.
  </p>
  <div class='newtheorem'>
  <!-- l. 210 --><p class='noindent'><span class='head'>
  <a id='x1-12001r3'></a>
<span class='ecbx-1000'>Definition 3.3 </span>(Annealing Schedule)<span class='ecbx-1000'>.</span>   </span>An    annealing
  schedule      specifies      the      inverse      temperature
  <!-- l. 211 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msup><mrow><mi>β</mi></mrow><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mi>t</mi><mo class='MathClass-close' stretchy='false'>)</mo></mrow></msup></math></span>
  at each step <!-- l. 211 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>t</mi> <mo class='MathClass-rel' stretchy='false'>∈</mo><mo class='MathClass-open' stretchy='false'>{</mo><mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>1</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mo>…</mo><mo class='MathClass-punc' stretchy='false'>,</mo><mi>T</mi><mo class='MathClass-close' stretchy='false'>}</mo></mrow></math></span>,
  where <!-- l. 211 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>T</mi></math></span>
 is      the      total      number      of      steps.      The
  schedule     interpolates     from     an     initial     value
  <!-- l. 211 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msup><mrow><mi>β</mi></mrow><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mn>0</mn><mo class='MathClass-close' stretchy='false'>)</mo></mrow></msup></math></span>
  to a final value <!-- l. 211 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msup><mrow><mi>β</mi></mrow><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mi>T</mi><mo class='MathClass-close' stretchy='false'>)</mo></mrow></msup></math></span>.
  </p>
  </div>
  <!-- l. 212 --><p class='noindent'> We consider two annealing schedules. The linear schedule
  increases <!-- l. 213 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>β</mi></math></span>
 at a constant rate: </p><table class='equation'><tr><td>
  <!-- l. 214 --><p class='noindent'>
  </p><!-- l. 214 --><math class='equation' display='block' xmlns='http://www.w3.org/1998/Math/MathML'><mrow>
                 <mstyle class='label' id='x1-12002r3'></mstyle><!-- endlabel --><msup><mrow><mi>β</mi></mrow><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mi>t</mi><mo class='MathClass-close' stretchy='false'>)</mo></mrow></msup> <mo class='MathClass-punc' stretchy='false'>:</mo><mo class='MathClass-rel' stretchy='false'>=</mo> <msup><mrow><mi>β</mi></mrow><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mn>0</mn><mo class='MathClass-close' stretchy='false'>)</mo></mrow></msup> <mo class='MathClass-bin' stretchy='false'>+</mo> <mrow><mo fence='true' form='prefix'>(</mo><mrow><msup><mrow><mi>β</mi></mrow><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mi>T</mi><mo class='MathClass-close' stretchy='false'>)</mo></mrow></msup> <mo class='MathClass-bin' stretchy='false'>−</mo> <msup><mrow><mi>β</mi></mrow><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mn>0</mn><mo class='MathClass-close' stretchy='false'>)</mo></mrow></msup></mrow><mo fence='true' form='postfix'>)</mo></mrow> <mo class='MathClass-bin' stretchy='false'>⋅</mo> <mfrac><mrow><mi>t</mi></mrow>
<mrow><mi>T</mi></mrow></mfrac><mo class='MathClass-punc' stretchy='false'>.</mo>
</mrow></math></td><td class='eq-no'>(3)</td></tr></table>
  <!-- l. 216 --><p class='noindent'>The exponential schedule increases
  <!-- l. 217 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>β</mi></math></span>
 geometrically, spending more iterations at lower temperatures:
  </p><table class='equation'><tr><td>
  <!-- l. 218 --><p class='noindent'>
  </p><!-- l. 218 --><math class='equation' display='block' xmlns='http://www.w3.org/1998/Math/MathML'><mrow>
                      <mstyle class='label' id='x1-12003r4'></mstyle><!-- endlabel --><msup><mrow><mi>β</mi></mrow><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mi>t</mi><mo class='MathClass-close' stretchy='false'>)</mo></mrow></msup> <mo class='MathClass-punc' stretchy='false'>:</mo><mo class='MathClass-rel' stretchy='false'>=</mo> <msup><mrow><mi>β</mi></mrow><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mn>0</mn><mo class='MathClass-close' stretchy='false'>)</mo></mrow></msup> <mo class='MathClass-bin' stretchy='false'>⋅</mo><msup><mrow><mrow><mo fence='true' form='prefix'>(</mo><mrow><mfrac><mrow><msup><mrow><mi>β</mi></mrow><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mi>T</mi><mo class='MathClass-close' stretchy='false'>)</mo></mrow></msup></mrow>
<mrow><msup><mrow><mi>β</mi></mrow><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mn>0</mn><mo class='MathClass-close' stretchy='false'>)</mo></mrow></msup></mrow></mfrac> </mrow><mo fence='true' form='postfix'>)</mo></mrow> </mrow><mrow><mi>t</mi><mo class='MathClass-bin' stretchy='false'>∕</mo><mi>T</mi></mrow></msup><mo class='MathClass-punc' stretchy='false'>.</mo>
</mrow></math></td><td class='eq-no'>(4)</td></tr></table>
  <!-- l. 220 --><p class='noindent'>
  </p>
  <div class='newtheorem'>
<!-- l. 222 --><p class='noindent'><span class='head'>
<a id='x1-12004r2'></a>
<span class='ecti-1000'>Remark </span>3.2 (Schedule Comparison)<span class='ecti-1000'>.</span>
</span>The  linear  schedule  provides  uniform  coverage  across
temperature  ranges,  while  the  exponential  schedule
allocates  more  steps  to  the  high-temperature  regime,
potentially   improving   exploration   before   the   final
cooling phase. The choice of schedule can significantly
affect   convergence   behavior,   as   we   investigate   in
Section <a href='#experimental-results'>4<!-- tex4ht:ref: sec:experiments  --></a>.
</p>
</div>
<!-- l. 224 --><p class='noindent'>
</p>
<h3 class='sectionHead' id='experimental-results'><span class='titlemark'>4   </span> <a id='x1-130004'></a>Experimental Results</h3>
<!-- l. 227 --><p class='noindent'>We evaluate the MCMC algorithm for board sizes
<!-- l. 227 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>4</mn></mrow></math></span> to
<!-- l. 227 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>11</mn></mrow></math></span>. A
sufficient condition for the existence of a zero-energy configuration
is <!-- l. 227 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi class='qopname'> gcd</mi><mo> ⁡<!-- FUNCTION APPLICATION --> </mo><mo class='MathClass-open' stretchy='false'>(</mo><mi>N</mi><mo class='MathClass-punc' stretchy='false'>,</mo><mn>210</mn><mo class='MathClass-close' stretchy='false'>)</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>1</mn></mrow></math></span>,
conjectured to be necessary [<a href='#XKunt2024nQueensHigherDimensions'>Kunt</a>, <a href='#XKunt2024nQueensHigherDimensions'>2024</a>]. Values
<!-- l. 227 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>∈</mo><mo class='MathClass-open' stretchy='false'>{</mo><mn>2</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mo>…</mo><mo class='MathClass-punc' stretchy='false'>,</mo><mn>10</mn><mo class='MathClass-close' stretchy='false'>}</mo></mrow></math></span> are proven unsolvable,
while <!-- l. 227 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>11</mn></mrow></math></span> admits
solutions. Thus, for <!-- l. 227 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>≤</mo> <mn>10</mn></mrow></math></span>
we expect convergence to positive energy, whereas for
<!-- l. 227 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>11</mn></mrow></math></span>
zero energy should be attainable.
</p><!-- l. 229 --><p class='noindent'>All experiments average energy over multiple independent
runs with distinct random seeds.
</p>
<h4 class='subsectionHead' id='choice-of-energy-transformation'><span class='titlemark'>4.1   </span> <a id='x1-140004.1'></a>Choice of Energy Transformation</h4>
<!-- l. 232 --><p class='noindent'>We compare the three transformations introduced in Section <a href='#energy-function'>2.4<!-- tex4ht:ref: subsec:energy  --></a>
for <!-- l. 232 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>11</mn></mrow></math></span>.
As shown in Figure <a href='#energy-evolution-for-n-a-logarithmic-oscillates-linear-and-quadratic-reach-zero-b-larger-enables-logarithmic-convergence-but-only-to-a-local-minimum'>1<!-- tex4ht:ref: fig:energy-transform  --></a>(a), linear and quadratic
transformations both converge, while the logarithmic
transformation oscillates without settling. Even with
a substantially larger inverse temperature range
(<!-- l. 232 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>β</mi> <mo class='MathClass-punc' stretchy='false'>:</mo> <mn>50</mn> <mo class='MathClass-rel' stretchy='false'>→</mo> <mn>10000</mn></mrow></math></span>), the
logarithmic case converges only to a local minimum with final
energy around 103 (Figure <a href='#energy-evolution-for-n-a-logarithmic-oscillates-linear-and-quadratic-reach-zero-b-larger-enables-logarithmic-convergence-but-only-to-a-local-minimum'>1<!-- tex4ht:ref: fig:energy-transform  --></a>(b)), as the compression of
energy differences flattens the landscape and traps the chain
in suboptimal configurations. The quadratic transformation
converges faster than linear but similarly fails to reach the
global minimum consistently. Only the linear transformation
reliably attains zero energy, and we therefore adopt
<!-- l. 232 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>g</mi><mo class='MathClass-open' stretchy='false'>(</mo><mi>x</mi><mo class='MathClass-close' stretchy='false'>)</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <mi>x</mi></mrow></math></span> for
all subsequent experiments.
</p>                                                 <figure class='figure' id='x1-14003r1'><span id='energy-evolution-for-n-a-logarithmic-oscillates-linear-and-quadratic-reach-zero-b-larger-enables-logarithmic-convergence-but-only-to-a-local-minimum'></span>
<div class='subfigure'>
<!-- l. 236 --><p class='noindent'></p><!-- l. 237 --><p class='noindent'><img alt='PIC' src='report/figures/energy-transform-comparison.png' /> <a id='x1-14001r1'></a>
</p>
<div class='caption'><span class='id'><span class='ecrm-0900'>(a)</span>
</span><span class='content'><!-- l. 238 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msub><mrow><mi>g</mi></mrow><mrow><mn>1</mn></mrow></msub><mo class='MathClass-open' stretchy='false'>(</mo><mi>x</mi><mo class='MathClass-close' stretchy='false'>)</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <mi>x</mi></mrow></math></span><span class='ecrm-0900'>,</span>
<!-- l. 238 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msub><mrow><mi>g</mi></mrow><mrow><mn>2</mn></mrow></msub><mo class='MathClass-open' stretchy='false'>(</mo><mi>x</mi><mo class='MathClass-close' stretchy='false'>)</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <msup><mrow><mi>x</mi></mrow><mrow><mn>2</mn></mrow></msup></mrow></math></span><span class='ecrm-0900'>,</span>
<!-- l. 238 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msub><mrow><mi>g</mi></mrow><mrow><mn>3</mn></mrow></msub><mo class='MathClass-open' stretchy='false'>(</mo><mi>x</mi><mo class='MathClass-close' stretchy='false'>)</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <mi class='loglike'>log</mi><mo>⁡<!-- FUNCTION APPLICATION --></mo><!-- nolimits --><mo class='MathClass-open' stretchy='false'>(</mo><mi>x</mi><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>
</span></div>                      </div>                                         <div class='subfigure'>
<!-- l. 240 --><p class='noindent'></p><!-- l. 241 --><p class='noindent'><img alt='PIC' src='report/figures/energy-log-high-beta.png' /> <a id='x1-14002r2'></a>
</p>
<div class='caption'><span class='id'><span class='ecrm-0900'>(b)</span>
</span><span class='content'><!-- l. 242 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>g</mi><mo class='MathClass-open' stretchy='false'>(</mo><mi>x</mi><mo class='MathClass-close' stretchy='false'>)</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <mi class='loglike'>log</mi><mo>⁡<!-- FUNCTION APPLICATION --></mo><!-- nolimits --><mo class='MathClass-open' stretchy='false'>(</mo><mi>x</mi><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>
<span class='ecrm-0900'>with</span>
<!-- l. 242 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>β</mi> <mo class='MathClass-punc' stretchy='false'>:</mo> <mn>50</mn> <mo class='MathClass-rel' stretchy='false'>→</mo><mn>10000</mn></mrow></math></span>
</span></div>                      </div>
<div class='caption'><span class='id'>Figure 1:            </span><span class='content'>Energy            evolution            for
<!-- l. 244 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>11</mn></mrow></math></span>.
(a)       Logarithmic       oscillates;       linear       and
quadratic         reach         zero.         (b)         Larger
<!-- l. 244 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>β</mi></math></span>
enables  logarithmic  convergence,  but  only  to  a  local
minimum.
</span></div>
</figure>
<h5 class='subsubsectionHead' id='nonuniqueness-of-solutions'><span class='titlemark'>4.1.1   </span> <a id='x1-150004.1.1'></a>Non-Uniqueness of Solutions</h5>
<!-- l. 249 --><p class='noindent'>When zero-energy configurations exist, they are generally
not unique. Figure <a href='#two-distinct-solutions-for-n'>2<!-- tex4ht:ref: fig:solutions  --></a> displays two distinct solutions for
<!-- l. 249 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>11</mn></mrow></math></span> obtained
with different <!-- l. 249 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>g</mi></math></span>
functions, represented as Latin squares where cell
<!-- l. 249 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mi>i</mi><mo class='MathClass-punc' stretchy='false'>,</mo><mi>j</mi><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span> contains the
queen’s height <!-- l. 249 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>k</mi></math></span>.
</p>
<figure class='figure' id='x1-15003r2'><span id='two-distinct-solutions-for-n'></span>
<div class='subfigure'>
<!-- l. 253 --><p class='noindent'></p><!-- l. 254 --><p class='noindent'><img alt='PIC' src='report/figures/solution-quadratic.png' /> <a id='x1-15001r1'></a>
</p>
<div class='caption'><span class='id'><span class='ecrm-0900'>(a)</span>
</span><span class='content'><!-- l. 255 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>g</mi><mo class='MathClass-open' stretchy='false'>(</mo><mi>x</mi><mo class='MathClass-close' stretchy='false'>)</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <msup><mrow><mi>x</mi></mrow><mrow><mn>2</mn></mrow></msup></mrow></math></span>
</span></div>                      </div>                                                  <div class='subfigure'>
<!-- l. 257 --><p class='noindent'></p><!-- l. 258 --><p class='noindent'><img alt='PIC' src='report/figures/solution-linear.png' /> <a id='x1-15002r2'></a>
</p>
<div class='caption'><span class='id'><span class='ecrm-0900'>(b)</span>
</span><span class='content'><!-- l. 259 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>g</mi><mo class='MathClass-open' stretchy='false'>(</mo><mi>x</mi><mo class='MathClass-close' stretchy='false'>)</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <mi>x</mi></mrow></math></span>
</span></div>                      </div>
<div class='caption'><span class='id'>Figure 2:       </span><span class='content'>Two       distinct       solutions       for
<!-- l. 261 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>11</mn></mrow></math></span>.
</span></div>
</figure>
<h4 class='subsectionHead' id='energy-evolution'><span class='titlemark'>4.2   </span> <a id='x1-160004.2'></a>Energy Evolution</h4>
<!-- l. 266 --><p class='noindent'>We examine energy evolution for
<!-- l. 266 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>4</mn></mrow></math></span> to
<!-- l. 266 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>11</mn></mrow></math></span>, using linear cooling
for <!-- l. 266 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>∈</mo><mo class='MathClass-open' stretchy='false'>{</mo><mn>4</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>5</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>6</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>11</mn><mo class='MathClass-close' stretchy='false'>}</mo></mrow></math></span> and geometric
cooling for <!-- l. 266 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>∈</mo><mo class='MathClass-open' stretchy='false'>{</mo><mn>7</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>8</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>9</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>10</mn><mo class='MathClass-close' stretchy='false'>}</mo></mrow></math></span>.
Full results appear in Appendix <a href='#energy-evolution-plots'>A<!-- tex4ht:ref: app:energy  --></a>; here we highlight the key
cases <!-- l. 266 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>10</mn></mrow></math></span>
and <!-- l. 266 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>11</mn></mrow></math></span>
in Figure <a href='#energy-evolution-for-n-unsolvable-and-n-solvable-iteration-axis-scaled-by-light-individual-runs-dark-average-'>3<!-- tex4ht:ref: fig:energy-main  --></a>.
</p><!-- l. 268 --><p class='noindent'>The two cooling schedules produce distinct descent
profiles. Linear cooling yields approximately linear
curves with steady descent, while geometric cooling
produces convex curves that drop rapidly early then
flatten as high-temperature steps concentrate at the
beginning. Both schedules converge to comparable final
energies.
</p><!-- l. 270 --><p class='noindent'>For <!-- l. 270 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>≤</mo> <mn>10</mn></mrow></math></span>,
energy stabilizes at positive values, consistent
with theoretical unsolvability. The final energy
increases with board size, from around 21 for
<!-- l. 270 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>4</mn></mrow></math></span> to 37
for <!-- l. 270 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>10</mn></mrow></math></span>.
For <!-- l. 270 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>11</mn></mrow></math></span>,
multiple runs reach zero energy, confirming existence of
valid solutions. The individual trajectories diverge: some
runs descend sharply to zero, while others plateau before
finding the global minimum.
</p>
<figure class='figure' id='x1-16003r3'><span id='energy-evolution-for-n-unsolvable-and-n-solvable-iteration-axis-scaled-by-light-individual-runs-dark-average-'></span>
<div class='subfigure'>
<!-- l. 274 --><p class='noindent'></p><!-- l. 275 --><p class='noindent'><img alt='PIC' src='report/figures/energy-n10.png' /> <a id='x1-16001r1'></a>
</p>
<div class='caption'><span class='id'><span class='ecrm-0900'>(a)</span>
</span><span class='content'><!-- l. 276 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>10</mn></mrow></math></span>
<span class='ecrm-0900'>(geometric)</span>
</span></div>                      </div>                                         <div class='subfigure'>
<!-- l. 278 --><p class='noindent'></p><!-- l. 279 --><p class='noindent'><img alt='PIC' src='report/figures/energy-n11.png' /> <a id='x1-16002r2'></a>
</p>
<div class='caption'><span class='id'><span class='ecrm-0900'>(b)</span>
</span><span class='content'><!-- l. 280 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>11</mn></mrow></math></span>
<span class='ecrm-0900'>(linear)</span>
</span></div>                      </div>
<div class='caption'><span class='id'>Figure 3:            </span><span class='content'>Energy            evolution            for
<!-- l. 282 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>10</mn></mrow></math></span>
(unsolvable) and <!-- l. 282 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>11</mn></mrow></math></span>
(solvable).        Iteration        axis        scaled        by
<!-- l. 282 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>1</mn><msup><mrow><mn>0</mn></mrow><mrow><mn>1</mn></mrow></msup></mrow></math></span>.
Light:       individual       runs;       dark:       average.
<!-- l. 282 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>β</mi> <mo class='MathClass-punc' stretchy='false'>:</mo> <mn>0.1</mn> <mo class='MathClass-rel' stretchy='false'>→</mo> <mn>5</mn></mrow></math></span>
</span></div>
</figure>
<h4 class='subsectionHead' id='effect-of-annealing-schedule'><span class='titlemark'>4.3   </span> <a id='x1-170004.3'></a>Effect of Annealing Schedule</h4>
<!-- l. 287 --><p class='noindent'>Simulated annealing gradually increases
<!-- l. 287 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>β</mi></math></span> to
balance exploration and exploitation. To assess whether this
schedule is necessary, we compare runs with constant
<!-- l. 287 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>β</mi></math></span>
values ranging from 0.01 to 1000 for
<!-- l. 287 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>11</mn></mrow></math></span>.
</p><!-- l. 289 --><p class='noindent'>As shown in Figure <a href='#energy-evolution-with-constant-for-n-low-oscillates-high-converges-to-zero'>4<!-- tex4ht:ref: fig:constant-beta  --></a>, low values
(<!-- l. 289 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>β</mi> <mo class='MathClass-rel' stretchy='false'>≤</mo> <mn>1</mn></mrow></math></span>)
accept too many uphill moves, causing the chain to
oscillate at high energy without converging. High values
(<!-- l. 289 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>β</mi> <mo class='MathClass-rel' stretchy='false'>≥</mo> <mn>10</mn></mrow></math></span>)
converge effectively to zero energy, suggesting that a greedy
approach suffices for this problem size. Moreover, larger
<!-- l. 289 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>β</mi></math></span> values yield faster
convergence: <!-- l. 289 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>β</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>1000</mn></mrow></math></span>
reaches zero energy in approximately 5000
iterations, compared to around 15000 for
<!-- l. 289 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>β</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>10</mn></mrow></math></span>.
This behavior likely reflects a relatively benign
energy landscape with few local minima. For larger
<!-- l. 289 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>N</mi></math></span>,
the solution space grows and local minima proliferate,
potentially requiring annealing to escape traps.
</p>
<figure class='figure'>
<!-- l. 293 --><p class='noindent' id='energy-evolution-with-constant-for-n-low-oscillates-high-converges-to-zero'><img alt='PIC' src='report/figures/constant-beta-comparison.png' /> <a id='x1-17001r4'></a>
</p>
<figcaption class='caption'><span class='id'>Figure 4:      </span><span class='content'>Energy      evolution      with      constant
<!-- l. 294 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>β</mi></math></span>
for <!-- l. 294 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>11</mn></mrow></math></span>.
Low <!-- l. 294 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>β</mi></math></span>
oscillates; high <!-- l. 294 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>β</mi></math></span>
converges to zero.                               </span></figcaption><!-- tex4ht:label?: x1-17001r4  -->
</figure>
<h4 class='subsectionHead' id='minimal-energy-vs-board-size'><span class='titlemark'>4.4   </span> <a id='x1-180004.4'></a>Minimal Energy vs Board Size</h4>
<!-- l. 299 --><p class='noindent'>We examine how the minimal achievable energy varies with board
size. Table <a href='#minimal-energy-achieved-for-each-board-size-only-n-reaches-zero'>1<!-- tex4ht:ref: tab:minimal-energy  --></a> reports the best energy obtained across all runs for
each <!-- l. 299 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>N</mi></math></span>.
</p><!-- l. 301 --><p class='noindent'>For <!-- l. 301 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>≤</mo> <mn>10</mn></mrow></math></span>,
the algorithm converges to positive energy,
with the minimum generally increasing with
<!-- l. 301 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>N</mi></math></span> as
the number of potential conflicts grows. The exception at
<!-- l. 301 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>10</mn></mrow></math></span>, which achieves
lower energy than <!-- l. 301 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>8</mn></mrow></math></span>
and <!-- l. 301 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>9</mn></mrow></math></span>, may
reflect variance across runs or favorable structure in the energy
landscape. For <!-- l. 301 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>11</mn></mrow></math></span>,
the algorithm reaches zero energy, confirming
the existence of a valid solution as predicted by
<!-- l. 301 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi class='qopname'> gcd</mi><mo> ⁡<!-- FUNCTION APPLICATION --> </mo><mo class='MathClass-open' stretchy='false'>(</mo><mn>11</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>210</mn><mo class='MathClass-close' stretchy='false'>)</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>1</mn></mrow></math></span>.
</p>
<div class='table'>
<!-- l. 303 --><p class='noindent'></p><figure class='float' id='x1-18001r1'><span id='minimal-energy-achieved-for-each-board-size-only-n-reaches-zero'></span>
<div class='tabular'> <table class='tabular' id='TBL-3' rules='groups'><colgroup id='TBL-3-1g'><col id='TBL-3-1' /></colgroup><colgroup id='TBL-3-2g'><col id='TBL-3-2' /><col id='TBL-3-3' /><col id='TBL-3-4' /><col id='TBL-3-5' /><col id='TBL-3-6' /><col id='TBL-3-7' /><col id='TBL-3-8' /><col id='TBL-3-9' /><col id='TBL-3-10' /></colgroup><tr class='array-hline'><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr id='TBL-3-1-' style='vertical-align:baseline;'><td class='td11' id='TBL-3-1-1' style='text-align:center; white-space:nowrap;'> <!-- l. 307 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>N</mi></math></span> </td><td class='td11' id='TBL-3-1-2' style='text-align:right; white-space:nowrap;'>  3  </td><td class='td11' id='TBL-3-1-3' style='text-align:right; white-space:nowrap;'>  4  </td><td class='td11' id='TBL-3-1-4' style='text-align:right; white-space:nowrap;'>  5  </td><td class='td11' id='TBL-3-1-5' style='text-align:right; white-space:nowrap;'>  6  </td><td class='td11' id='TBL-3-1-6' style='text-align:right; white-space:nowrap;'>  7  </td><td class='td11' id='TBL-3-1-7' style='text-align:right; white-space:nowrap;'>  8  </td><td class='td11' id='TBL-3-1-8' style='text-align:right; white-space:nowrap;'>  9  </td><td class='td11' id='TBL-3-1-9' style='text-align:right; white-space:nowrap;'> 10  </td><td class='td11' id='TBL-3-1-10' style='text-align:right; white-space:nowrap;'> 11  </td></tr><tr class='array-hline'><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr id='TBL-3-2-' style='vertical-align:baseline;'><td class='td11' id='TBL-3-2-1' style='text-align:center; white-space:nowrap;'> <!-- l. 309 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mi>J</mi></mrow><mrow>
<mi class='qopname'>min</mi><mo> ⁡<!-- FUNCTION APPLICATION --> </mo></mrow></msub></math></span>   </td><td class='td11' id='TBL-3-2-2' style='text-align:right; white-space:nowrap;'> 13  </td><td class='td11' id='TBL-3-2-3' style='text-align:right; white-space:nowrap;'> 21  </td><td class='td11' id='TBL-3-2-4' style='text-align:right; white-space:nowrap;'> 32  </td><td class='td11' id='TBL-3-2-5' style='text-align:right; white-space:nowrap;'> 41  </td><td class='td11' id='TBL-3-2-6' style='text-align:right; white-space:nowrap;'> 50  </td><td class='td11' id='TBL-3-2-7' style='text-align:right; white-space:nowrap;'> 53  </td><td class='td11' id='TBL-3-2-8' style='text-align:right; white-space:nowrap;'> 55  </td><td class='td11' id='TBL-3-2-9' style='text-align:right; white-space:nowrap;'> 36  </td><td class='td11' id='TBL-3-2-10' style='text-align:right; white-space:nowrap;'>  <span class='ecbx-1000'>0  </span></td>
</tr><tr class='array-hline'><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></table>                                                        </div>
<figcaption class='caption'><span class='id'>Table 1: </span><span class='content'>Minimal energy achieved for each board size.
Only
<!-- l. 312 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>11</mn></mrow></math></span>
reaches zero.
</span></figcaption><!-- tex4ht:label?: x1-18001r1  -->
</figure>
</div>
<h4 class='subsectionHead' id='favorable-values-of-n'><span class='titlemark'>4.5   </span> <a id='x1-190004.5'></a>Favorable Values of <!-- l. 316 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>N</mi></math></span></h4>
<!-- l. 317 --><p class='noindent'>We identify which board sizes admit zero-energy
configurations. Among all tested values, only
<!-- l. 317 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>11</mn></mrow></math></span> achieves
zero energy (Figure <a href='#energy-evolution-for-n-unsolvable-and-n-solvable-iteration-axis-scaled-by-light-individual-runs-dark-average-'>3<!-- tex4ht:ref: fig:energy-main  --></a>), with a representative solution shown
in Figure <a href='#two-distinct-solutions-for-n'>2<!-- tex4ht:ref: fig:solutions  --></a>. This result aligns with the theoretical condition
<!-- l. 317 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi class='qopname'> gcd</mi><mo> ⁡<!-- FUNCTION APPLICATION --> </mo><mo class='MathClass-open' stretchy='false'>(</mo><mi>N</mi><mo class='MathClass-punc' stretchy='false'>,</mo><mn>210</mn><mo class='MathClass-close' stretchy='false'>)</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>1</mn></mrow></math></span>: since 11
is coprime to 210, a solution is guaranteed to exist. Conversely,
for <!-- l. 317 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>4</mn></mrow></math></span>
to 10, all of which share common factors with 210, the
algorithm converges to positive energy, empirically
confirming their unsolvability.
</p>
<h3 class='sectionHead' id='conclusion'><span class='titlemark'>5   </span> <a id='x1-200005'></a>Conclusion</h3>
<!-- l. 320 --><p class='noindent'>We have presented an MCMC approach to the three-dimensional
<!-- l. 320 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msup><mrow><mi>N</mi></mrow><mrow><mn>2</mn></mrow></msup></math></span>-queens problem,
placing <!-- l. 320 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msup><mrow><mi>N</mi></mrow><mrow><mn>2</mn></mrow></msup></math></span> non-attacking
queens on an <!-- l. 320 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-bin' stretchy='false'>×</mo> <mi>N</mi> <mo class='MathClass-bin' stretchy='false'>×</mo> <mi>N</mi></mrow></math></span>
board. Our formulation defines attack relations generalizing
classical chess moves to three dimensions, introduces an
energy function counting attacking pairs, and constructs a
Metropolis-Hastings chain with provable correctness
guarantees.
</p><!-- l. 322 --><p class='noindent'>Experimental results across
<!-- l. 322 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>3</mn></mrow></math></span> to
<!-- l. 322 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>11</mn></mrow></math></span>
confirm theoretical predictions: the algorithm
converges to positive energy for unsolvable instances
(<!-- l. 322 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>≤</mo> <mn>10</mn></mrow></math></span>)
and successfully finds zero-energy configurations for
<!-- l. 322 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>11</mn></mrow></math></span>,
consistent with the sufficient condition
<!-- l. 322 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi class='qopname'> gcd</mi><mo> ⁡<!-- FUNCTION APPLICATION --> </mo><mo class='MathClass-open' stretchy='false'>(</mo><mi>N</mi><mo class='MathClass-punc' stretchy='false'>,</mo><mn>210</mn><mo class='MathClass-close' stretchy='false'>)</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>1</mn></mrow></math></span>. Our
analysis of energy transformations reveals that only the linear
function <!-- l. 322 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>g</mi><mo class='MathClass-open' stretchy='false'>(</mo><mi>x</mi><mo class='MathClass-close' stretchy='false'>)</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <mi>x</mi></mrow></math></span>
reliably reaches global minima, while quadratic
and logarithmic alternatives distort the energy
landscape unfavorably. Surprisingly, for moderate
<!-- l. 322 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>N</mi></math></span>, constant
high-<!-- l. 322 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>β</mi></math></span>
schedules outperform simulated annealing, suggesting a
relatively benign landscape with few local minima at these
problem sizes.
</p><!-- l. 324 --><p class='noindent'>Several directions remain for future work. Most promising is
adopting the restricted state space formulation discussed in
Section <a href='#problem-formulation'>2<!-- tex4ht:ref: sec:formulation  --></a>, which encodes configurations as functions
<!-- l. 324 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>κ</mi> <mo class='MathClass-punc' stretchy='false'>:</mo> <msup><mrow><mo class='MathClass-open' stretchy='false'>{</mo><mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mo>…</mo><mo class='MathClass-punc' stretchy='false'>,</mo><mi>N</mi> <mo class='MathClass-bin' stretchy='false'>−</mo> <mn>1</mn><mo class='MathClass-close' stretchy='false'>}</mo></mrow><mrow><mn>2</mn></mrow></msup> <mo class='MathClass-rel' stretchy='false'>→</mo><mo class='MathClass-open' stretchy='false'>{</mo><mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mo>…</mo><mo class='MathClass-punc' stretchy='false'>,</mo><mi>N</mi> <mo class='MathClass-bin' stretchy='false'>−</mo> <mn>1</mn><mo class='MathClass-close' stretchy='false'>}</mo></mrow></math></span>.   This representation reduces the state space from
  <!-- l. 324 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mrow><mo fence='true' form='prefix'>(</mo><mfrac linethickness='0.0pt'><mrow><msup><mrow><mi>N</mi></mrow><mrow><mn>3</mn></mrow></msup></mrow>
<mrow><msup><mrow><mi>N</mi></mrow><mrow><mn>2</mn></mrow></msup></mrow></mfrac><mo fence='true' form='postfix'>)</mo></mrow> </mrow></math></span> to
  <!-- l. 324 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msup><mrow><mi>N</mi></mrow><mrow><msup><mrow><mi>N</mi></mrow><mrow><mn>2</mn></mrow></msup>
     </mrow></msup></math></span>,
  eliminates rook-type attacks along one axis by construction,
  and preserves all zero-energy solutions. The resulting efficiency
  gains would enable exploration of larger solvable values such as
  <!-- l. 324 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>13</mn></mrow></math></span>, 17, or 19.
  Additionally, all <!-- l. 324 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>β</mi></math></span>
 tuning in this work was performed manually; systematic
  approaches such as grid search over initial and final
  <!-- l. 324 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>β</mi></math></span>
 values, or adaptive update rules, could further improve
  convergence. Other directions include informed proposal
  distributions targeting high-conflict queens and theoretical
  analysis of the energy landscape structure.
  </p>
  <h3 class='likesectionHead' id='references'><a id='x1-21000'></a>References</h3>
  <!-- l. 326 --><p class='noindent'>
     </p><div class='thebibliography'>
     <p class='bibitem'><span class='biblabel'>
<a id='XKunt2024nQueensHigherDimensions'></a>  <span class='bibsp'>   </span></span>Tim Kunt. The <!-- l. 328 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>n</mi></math></span>-queens
     problem    in    higher    dimensions,    2024.    URL
     <a class='url' href='https://arxiv.org/abs/2406.06260'><span class='ectt-1000'>https://arxiv.org/abs/2406.06260</span></a>.</p></div>
<h3 class='sectionHead' id='energy-evolution-plots'><span class='titlemark'>A   </span> <a id='x1-22000A'></a>Energy Evolution Plots</h3>
<!-- l. 334 --><p class='noindent'>Figure <a href='#energy-evolution-for-n-to-n-linear-cooling-for-n-geometric-for-n-iteration-axis-scaled-by-light-individual-runs-dark-average-'>5<!-- tex4ht:ref: fig:energy-all  --></a> presents energy evolution for all board sizes
<!-- l. 334 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>4</mn></mrow></math></span> to
<!-- l. 334 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>11</mn></mrow></math></span>.
</p>
<figure class='figure' id='x1-22009r5'><span id='energy-evolution-for-n-to-n-linear-cooling-for-n-geometric-for-n-iteration-axis-scaled-by-light-individual-runs-dark-average-'></span>
<div class='subfigure'>
<!-- l. 338 --><p class='noindent'></p><!-- l. 339 --><p class='noindent'><img alt='PIC' src='report/figures/energy-n4.png' /> <a id='x1-22001r1'></a>
</p>
<div class='caption'><span class='id'><span class='ecrm-0900'>(a)</span>
</span><span class='content'><!-- l. 340 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>4</mn></mrow></math></span>
<span class='ecrm-0900'>(linear)</span>
</span></div>                      </div>                                         <div class='subfigure'>
<!-- l. 342 --><p class='noindent'></p><!-- l. 343 --><p class='noindent'><img alt='PIC' src='report/figures/energy-n5.png' /> <a id='x1-22002r2'></a>
</p>
<div class='caption'><span class='id'><span class='ecrm-0900'>(b)</span>
</span><span class='content'><!-- l. 344 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>5</mn></mrow></math></span>
<span class='ecrm-0900'>(linear)</span>
</span></div>                      </div>
<div class='subfigure'>
<!-- l. 347 --><p class='noindent'></p><!-- l. 348 --><p class='noindent'><img alt='PIC' src='report/figures/energy-n6.png' /> <a id='x1-22003r3'></a>
</p>
<div class='caption'><span class='id'><span class='ecrm-0900'>(c)</span>
</span><span class='content'><!-- l. 349 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>6</mn></mrow></math></span>
<span class='ecrm-0900'>(linear)</span>
</span></div>                      </div>                                         <div class='subfigure'>
<!-- l. 351 --><p class='noindent'></p><!-- l. 352 --><p class='noindent'><img alt='PIC' src='report/figures/energy-n7.png' /> <a id='x1-22004r4'></a>
</p>
<div class='caption'><span class='id'><span class='ecrm-0900'>(d)</span>
</span><span class='content'><!-- l. 353 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>7</mn></mrow></math></span>
<span class='ecrm-0900'>(geometric)</span>
</span></div>                      </div>
<div class='subfigure'>
<!-- l. 356 --><p class='noindent'></p><!-- l. 357 --><p class='noindent'><img alt='PIC' src='report/figures/energy-n8.png' /> <a id='x1-22005r5'></a>
</p>
<div class='caption'><span class='id'><span class='ecrm-0900'>(e)</span>
</span><span class='content'><!-- l. 358 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>8</mn></mrow></math></span>
<span class='ecrm-0900'>(geometric)</span>
</span></div>                      </div>                                         <div class='subfigure'>
<!-- l. 360 --><p class='noindent'></p><!-- l. 361 --><p class='noindent'><img alt='PIC' src='report/figures/energy-n9.png' /> <a id='x1-22006r6'></a>
</p>
<div class='caption'><span class='id'><span class='ecrm-0900'>(f)</span>
</span><span class='content'><!-- l. 362 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>9</mn></mrow></math></span>
<span class='ecrm-0900'>(geometric)</span>
</span></div>                      </div>
<div class='subfigure'>
<!-- l. 365 --><p class='noindent'></p><!-- l. 366 --><p class='noindent'><img alt='PIC' src='report/figures/energy-n10.png' /> <a id='x1-22007r7'></a>
</p>
<div class='caption'><span class='id'><span class='ecrm-0900'>(g)</span>
</span><span class='content'><!-- l. 367 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>10</mn></mrow></math></span>
<span class='ecrm-0900'>(geometric)</span>
</span></div>                      </div>                                         <div class='subfigure'>
<!-- l. 369 --><p class='noindent'></p><!-- l. 370 --><p class='noindent'><img alt='PIC' src='report/figures/energy-n11.png' /> <a id='x1-22008r8'></a>
</p>
<div class='caption'><span class='id'><span class='ecrm-0900'>(h)</span>
</span><span class='content'><!-- l. 371 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>11</mn></mrow></math></span>
<span class='ecrm-0900'>(linear)</span>
</span></div>                      </div>
<div class='caption'><span class='id'>Figure 5:            </span><span class='content'>Energy            evolution            for
<!-- l. 373 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>4</mn></mrow></math></span>
to <!-- l. 373 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>11</mn></mrow></math></span>.
Linear cooling for <!-- l. 373 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>∈</mo><mo class='MathClass-open' stretchy='false'>{</mo><mn>4</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>5</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>6</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>11</mn><mo class='MathClass-close' stretchy='false'>}</mo></mrow></math></span>;
geometric for <!-- l. 373 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>N</mi> <mo class='MathClass-rel' stretchy='false'>∈</mo><mo class='MathClass-open' stretchy='false'>{</mo><mn>7</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>8</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>9</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>10</mn><mo class='MathClass-close' stretchy='false'>}</mo></mrow></math></span>.
Iteration               axis               scaled               by
<!-- l. 373 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>1</mn><msup><mrow><mn>0</mn></mrow><mrow><mn>1</mn></mrow></msup></mrow></math></span>.
Light:       individual       runs;       dark:       average.
<!-- l. 373 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>β</mi> <mo class='MathClass-punc' stretchy='false'>:</mo> <mn>0.1</mn> <mo class='MathClass-rel' stretchy='false'>→</mo> <mn>5</mn></mrow></math></span>.
</span></div>
</figure>
</div>
