# Bandit algorithms for neighbour sampling in decentralized learning

we study multi-armed bandit algorithms for 
adaptive neighbour sampling in decentralized learning. Focused on their ability to recover latent client clusters under 
data heterogeneity. Evaluated on FEMNIST (Federated MNIST) classification.

[GitHub repository](https://github.com/renonesopocaj/bandit-decentralized-learning)

<!-- COMPLETE ORIGINAL REPORT -->
<div class="report report-bandit-decentralized-learning">
<div class='maketitle'>
<h2 class='titleHead'>Optimization in Decentralized Learning with
Adaptive Neighbor Sampling</h2>
         <div class='author'> <span class='cmr-12'>Alessandro Bombarda, Mattea Busato, Jacopo Senoner</span>
<br /> <span class='cmti-12'>School of Computer and Communication Sciences, EPFL, Switzerland </span></div><br />
   </div>
   <section class='abstract' role='doc-abstract'>
<h3 class='abstracttitle'>
<span class='cmbx-9'>Abstract</span>
</h3>
     <!-- l. 43 --><p class='noindent'><span class='cmr-9'>Decentralized learning avoids a parameter server but requires peer-to-peer
     model exchange. Recent work shows that uniformly pulling a logarithmic
     number   of   neighbors   can   reduce   communication   while   retaining
     convergence and robustness guarantees; we ask whether adaptive sampling
     can  improve  on  this  uniform  baseline  under  heterogeneous  data.  We
     formulate  neighbor  selection  as  a  combinatorial  semi-bandit  problem
     and compare different no-regret samplers under two reward signals. Our
     contributions  are  three  empirical  observations:  (i)  adaptive  samplers
     recover  latent  cluster  structure  from  local  feedback;  (ii)  this  recovery
     induces a personalization–generalization frontier, with aggressive samplers
     such  as  CTS  favoring  local  accuracy  and  milder  samplers  such  as
     EXP3  or  discounted  variants  preserving  more  global  mixing;  (iii)  the
     reward  shape  affects  the  algorithm’s  position  on  the  frontier;  (iv)  in
     static clusters, discounting weakens cluster recovery by forgetting useful
     historical evidence.</span>
</p>
</section>
   <h3 class='sectionHead' id='introduction'><span class='titlemark'>I. </span> <a id='x1-1000I'></a>Introduction</h3>
<!-- l. 61 --><p class='noindent'>In federated learning a server aggregates client updates; a serverless decentralized
system removes this coordination point, but information must instead spread through
peer-to-peer exchanges, and dense decentralized methods incur message complexity
that grows quadratically in the number of nodes. Robust Pull-based Epidemic
Learning (RPEL) <span class='cite'>[<a href='#Xrpel'>3</a>]</span> reduces this burden by having each node pull models
from a small, uniformly random subset of peers; its analysis requires only
<!-- l. 61 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>O</mi><mo class='MathClass-open' stretchy='false'>(</mo><mi class='loglike'>log</mi><mo>⁡<!-- FUNCTION APPLICATION --></mo><!-- nolimits --><mi>n</mi><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span> sampled peers and
yields <!-- l. 61 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>O</mi><mo class='MathClass-open' stretchy='false'>(</mo><mi>n</mi><mi class='loglike'>log</mi><mo>⁡<!-- FUNCTION APPLICATION --></mo><!-- nolimits --><mi>n</mi><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span> messages per
round rather than <!-- l. 61 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>O</mi><mo class='MathClass-open' stretchy='false'>(</mo><msup><mrow><mi>n</mi></mrow><mrow><mn>2</mn></mrow></msup><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>,
while preserving convergence and Byzantine-robustness guarantees with high
probability.
</p><!-- l. 63 --><p class='indent'>   Uniform sampling is deliberately agnostic to data heterogeneity. When clients
form latent groups, however, some peers provide systematically more useful model
updates than others, and averaging indiscriminately mixes incompatible objectives
and harms per-client performance. This motivates our question: <span class='cmti-10'>when does adaptive
neighbor sampling improve learning at a fixed communication budget, and
when is uniform sampling preferable? </span>Selecting which neighbors to pull is
naturally an online decision: a node does not know in advance which peers
are useful and must trade exploration against exploitation. We therefore
model every candidate neighbor as an arm; at each round a node selects
<!-- l. 63 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>s</mi></math></span>
arms and observes one reward per selected neighbor, giving a combinatorial
semi-bandit.
</p>
<!-- l. 65 --><p class='noindent'><span class='paragraphHead' id='research-questions'><a id='x1-2000'></a><span class='cmbx-10'>Research questions</span></span>
   (Q1) Does bandit-based neighbor selection improve performance over uniform random sampling
and a fixed <!-- l. 66 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>d</mi></math></span>-regular
topology at equal communication, and how does this depend on heterogeneity?
(Q2) Does the converged sampling distribution recover the latent cluster
structure of the partition? (Q3) Which reward signal best drives the bandit, and
does decreasing realized regret correspond to better learning? (Q4) How
does discounting reposition a sampler on the personalization–generalization
front?
</p>
<!-- l. 72 --><p class='noindent'><span class='paragraphHead' id='contributions'><a id='x1-3000'></a><span class='cmbx-10'>Contributions</span></span>
   (i) a controlled comparison of adaptive sampler families against uniform sampling
and a fixed topology, under an identical communication budget, reporting both
accuracy and communication efficiency; (ii) an evaluation across heterogeneous
partitions with cluster-level and node-level structure, testing whether the learned
distribution recovers cluster structure; (iii) diagnostics that separate downstream
learning quality from reward maximization and graph-structure recovery, with the
key finding that the three can diverge; (iv) finally, we study the relationship between
discounting and the ability of bandit algorithms to recover the latent cluster
structure.
</p>
   <h3 class='sectionHead' id='method'><span class='titlemark'>II. </span> <a id='x1-4000II'></a>Method</h3>
   <h4 class='subsectionHead' id='related-work'><span class='titlemark'>A. </span> <a id='x1-5000A'></a>Related work</h4>
<!-- l. 82 --><p class='noindent'>Our problem sits between three lines of work. <span class='cmti-10'>Neighbor selection </span>starts from the
observation that, under non-i.i.d. data, not all neighbors are equally useful and uniform
gossip is suboptimal: AFIND+ <span class='cite'>[<a href='#Xafind'>1</a>]</span> makes sampling adaptive through gradient
similarity (using the featurizer output as a proxy for a client’s distribution), adapts
the number of sampled neighbors via an entropy-based threshold, and aggregates
with contribution-aware weights. <span class='cmti-10'>Bandit formulations </span>make the selection explicit:
DFedDC <span class='cite'>[<a href='#Xdfeddc'>2</a>]</span> casts dynamic neighbor selection as a multi-armed bandit with a dynamic
<!-- l. 82 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>𝜀</mi></math></span>-greedy
policy, comparing clients through Dynamic Time Warping of gradient-norm
sequences and aggregating by confidence. A <span class='cmti-10'>complementary lever </span>changes how
updates are weighted rather than whom to sample: FedAAW <span class='cite'>[<a href='#Xfedaaw'>4</a>]</span> derives aggregation
weights analytically by minimizing a convergence bound, but in the centralized
(server-based) setting. Our starting point is RPEL <span class='cite'>[<a href='#Xrpel'>3</a>]</span>, which samples peers
uniformly at random in a pull-based epidemic protocol to obtain robustness at
<!-- l. 82 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>O</mi><mo class='MathClass-open' stretchy='false'>(</mo><mi>n</mi><mi class='loglike'>log</mi><mo>⁡<!-- FUNCTION APPLICATION --></mo><!-- nolimits --><mi>n</mi><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>
communication; its sampling is deliberately preference-free, which is exactly the
design choice we interrogate.
</p>
   <h4 class='subsectionHead' id='decentralized-learning-and-feedback'><span class='titlemark'>B. </span> <a id='x1-6000B'></a>Decentralized learning and feedback</h4>
<!-- l. 86 --><p class='noindent'>We consider <!-- l. 86 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>n</mi></math></span>
nodes in a fully-connected network topology. Node
<!-- l. 86 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>i</mi></math></span> holds local data
from distribution <!-- l. 86 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mstyle mathvariant='script'><mi>𝒟</mi></mstyle></mrow><mrow><mi>i</mi></mrow></msub></math></span>
and parameters <!-- l. 86 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msubsup><mrow><mi>w</mi></mrow><mrow><mi>i</mi></mrow><mrow><mi>t</mi></mrow></msubsup></math></span>.
In round <!-- l. 86 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>t</mi></math></span>,
every node performs one or more local SGD steps, selects a subset
<!-- l. 86 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msubsup><mrow><mi>S</mi></mrow><mrow><mi>i</mi></mrow><mrow><mi>t</mi></mrow></msubsup> <mo class='MathClass-rel' stretchy='false'>⊆</mo> <mo class='MathClass-open' stretchy='false'>[</mo><mi>n</mi><mo class='MathClass-close' stretchy='false'>]</mo> <mo class='MathClass-bin' stretchy='false'>∖</mo><mo class='MathClass-open' stretchy='false'>{</mo><mi>i</mi><mo class='MathClass-close' stretchy='false'>}</mo></mrow></math></span> of size
<!-- l. 86 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>s</mi></math></span>, pulls
those models, and averages them with its own model. Communication per round is thus
of <!-- l. 86 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi mathvariant='italic'>𝑛𝑠</mi></mrow></math></span>
model transmissions for every compared sampler; full communication would use
<!-- l. 86 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>n</mi><mo class='MathClass-open' stretchy='false'>(</mo><mi>n</mi> <mo class='MathClass-bin' stretchy='false'>−</mo> <mn>1</mn><mo class='MathClass-close' stretchy='false'>)</mo></mrow></math></span>.
</p><!-- l. 88 --><p class='indent'>   After sampling, node <!-- l. 88 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>i</mi></math></span>
observes rewards <!-- l. 88 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mi>r</mi></mrow><mrow><mi>j</mi></mrow></msub></math></span>
for <!-- l. 88 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>j</mi> <mo class='MathClass-rel' stretchy='false'>∈</mo> <msubsup><mrow><mi>S</mi></mrow><mrow><mi>i</mi></mrow><mrow><mi>t</mi></mrow></msubsup></mrow></math></span>.
We study two reward models: <span class='cmbx-10'>inverse model distance </span>(for short <span class='cmbx-10'>IMD</span>) and <span class='cmbx-10'>cosine
similarity </span>(for short <span class='cmbx-10'>COS</span>) defined respectively as:
</p><!-- tex4ht:inline --><!-- l. 96 --><math display='block' xmlns='http://www.w3.org/1998/Math/MathML'><mtable class='align-star' columnalign='left' displaystyle='true' rowlines='' style=''>
                   <mtr><mtd class='align-odd' columnalign='right'><msubsup><mrow><mi>r</mi></mrow><mrow><mi mathvariant='italic'>𝑖𝑗</mi><mo class='MathClass-punc' stretchy='false'>,</mo><mi>t</mi></mrow><mrow><mstyle mathvariant='normal'><mi>dist</mi></mstyle></mrow></msubsup></mtd>                   <mtd class='align-even'> <mo class='MathClass-rel' stretchy='false'>=</mo> <msup><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mn>1</mn> <mo class='MathClass-bin' stretchy='false'>+</mo> <mo class='MathClass-rel' stretchy='false'>∥</mo><msubsup><mrow><mi>w</mi></mrow><mrow>
<mi>i</mi></mrow><mrow><mi>t</mi></mrow></msubsup> <mo class='MathClass-bin' stretchy='false'>−</mo> <msubsup><mrow><mi>w</mi></mrow><mrow>
<mi>j</mi></mrow><mrow><mi>t</mi></mrow></msubsup><msub><mrow><mo class='MathClass-rel' stretchy='false'>∥</mo></mrow><mrow>
<mn>2</mn></mrow></msub><mo class='MathClass-close' stretchy='false'>)</mo></mrow><mrow><mo class='MathClass-bin' stretchy='false'>−</mo><mn>1</mn></mrow></msup><mo class='MathClass-punc' stretchy='false'>,</mo><mspace width='2em'></mspace></mtd>                     <mtd class='align-label' columnalign='right'></mtd>                   <mtd class='align-label'>
                   <mspace width='2em'></mspace></mtd></mtr><mtr><mtd class='align-odd' columnalign='right'><msubsup><mrow><mi>r</mi></mrow><mrow><mi mathvariant='italic'>𝑖𝑗</mi><mo class='MathClass-punc' stretchy='false'>,</mo><mi>t</mi></mrow><mrow><mstyle mathvariant='normal'><mi>upd</mi></mstyle></mrow></msubsup></mtd>                   <mtd class='align-even'> <mo class='MathClass-rel' stretchy='false'>=</mo> <mstyle displaystyle='false'><mfrac><mrow><mn>1</mn>
</mrow><mrow><mn>2</mn></mrow></mfrac></mstyle><mspace class='negthinspace' width='-0.17em'></mspace> <mrow><mo fence='true' form='prefix'>(</mo><mrow><mn>1</mn> <mo class='MathClass-bin' stretchy='false'>+</mo>    <mfrac><mrow><mo class='MathClass-open' stretchy='false'>⟨</mo><mi mathvariant='normal'>Δ</mi><msubsup><mrow><mi>w</mi></mrow><mrow><mi>i</mi></mrow><mrow><mi>t</mi></mrow></msubsup><mo class='MathClass-punc' stretchy='false'>,</mo><mi mathvariant='normal'>Δ</mi><msubsup><mrow><mi>w</mi></mrow><mrow><mi>j</mi></mrow><mrow><mi>t</mi></mrow></msubsup><mo class='MathClass-close' stretchy='false'>⟩</mo></mrow>
<mrow><mo class='MathClass-rel' stretchy='false'>∥</mo><mi mathvariant='normal'>Δ</mi><msubsup><mrow><mi>w</mi></mrow><mrow><mi>i</mi></mrow><mrow><mi>t</mi></mrow></msubsup><msub><mrow><mo class='MathClass-rel' stretchy='false'>∥</mo></mrow><mrow><mn>2</mn></mrow></msub><mo class='MathClass-rel' stretchy='false'>∥</mo><mi mathvariant='normal'>Δ</mi><msubsup><mrow><mi>w</mi></mrow><mrow><mi>j</mi></mrow><mrow><mi>t</mi></mrow></msubsup><msub><mrow><mo class='MathClass-rel' stretchy='false'>∥</mo></mrow><mrow><mn>2</mn></mrow></msub></mrow></mfrac> </mrow><mo fence='true' form='postfix'>)</mo></mrow> <mo class='MathClass-punc' stretchy='false'>,</mo><mspace width='2em'></mspace></mtd>                   <mtd class='align-label' columnalign='right'></mtd>                   <mtd class='align-label'>
   <mspace width='2em'></mspace></mtd></mtr></mtable></math>
<!-- l. 105 --><p class='noindent'>where <!-- l. 105 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi mathvariant='normal'>Δ</mi><msubsup><mrow><mi>w</mi></mrow><mrow><mi>i</mi></mrow><mrow><mi>t</mi></mrow></msubsup> <mo class='MathClass-rel' stretchy='false'>=</mo> <msubsup><mrow><mi>w</mi></mrow><mrow><mi>i</mi></mrow><mrow><mi>t</mi><mo class='MathClass-bin' stretchy='false'>−</mo><mfrac><mrow><mn>1</mn></mrow>
<mrow><mn>2</mn></mrow></mfrac> </mrow></msubsup> <mo class='MathClass-bin' stretchy='false'>−</mo> <msubsup><mrow><mi>w</mi></mrow><mrow><mi>i</mi></mrow><mrow><mi>t</mi><mo class='MathClass-bin' stretchy='false'>−</mo><mn>1</mn></mrow></msubsup></mrow></math></span>
is the pre-aggregation local update. These rewards encode model compatibility, not
direct loss reduction, so their alignment with the learning objective is an empirical
question we study in <a href='#results-and-discussion'>IV<!-- tex4ht:ref: results:reward  --></a>.
</p>
   <h4 class='subsectionHead' id='neighbor-samplers'><span class='titlemark'>C. </span> <a id='x1-7000C'></a>Neighbor samplers</h4>
<!-- l. 110 --><p class='noindent'>Our baseline is the uniform distribution among
<!-- l. 110 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>s</mi></math></span> distinct neighbors. We
compare <!-- l. 111 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>𝜖</mi></math></span><span class='cmcsc-10'>-G<span class='small-caps'>reedy</span></span>,
<span class='cmcsc-10'>EXP3</span>, <span class='cmcsc-10'>CUCB</span>, and <span class='cmcsc-10'>CTS</span>. CUCB selects the
<!-- l. 112 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>s</mi></math></span> largest upper confidence
indices; CTS selects the <!-- l. 112 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>s</mi></math></span>
largest independent Beta posterior draws. Discounted CUCB and CTS multiply sufficient statistics
by a discount <!-- l. 112 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>γ</mi> <mo class='MathClass-rel' stretchy='false'>&lt;</mo> <mn>1</mn></mrow></math></span>
before each update, prioritizing recent observations <span class='cite'>[<a href='#Xgarivier2011ucb'>19</a>]</span>. In our experiments, we hold
<!-- l. 112 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>γ</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>0.99</mn></mrow></math></span>, and
we do separate ablations on this value in appendix <a href='#further-results-on-cifar'>D<!-- tex4ht:ref: app:discount-ablations  --></a>. All methods are compared
across identical data splits, initialization protocol, local optimization, and
communication budget.
</p>
   <h3 class='sectionHead' id='experimental-design'><span class='titlemark'>III. </span> <a id='x1-8000III'></a>Experimental Design</h3>
<!-- l. 118 --><p class='noindent'><span class='cmbx-10'>Data heterogeneity. </span>We use pooled FEMNIST with two synthetic partition
families. Dirichlet partitions draw class proportions with concentration
<!-- l. 121 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>α</mi> <mo class='MathClass-rel' stretchy='false'>∈</mo><mo class='MathClass-open' stretchy='false'>{</mo><mn>0.5</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>1</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>10</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>100</mn><mo class='MathClass-close' stretchy='false'>}</mo></mrow></math></span>; smaller
<!-- l. 121 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>α</mi></math></span>
means stronger heterogeneity. Pathological partitions assign
<!-- l. 122 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>k</mi></math></span> labels to each
group, with overlap <!-- l. 122 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>o</mi></math></span>
between consecutive groups. A group can be a latent cluster whose nodes share its samples
uniformly, or a single node. We additionally use FEMNIST’s natural writer identities <span class='cite'>[<a href='#Xcaldas2018leaf'>20</a>]</span>,
assigning <!-- l. 122 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>k</mi></math></span>
writers per node and holding out complete writers for global evaluation. Finally, in
Appendix <a href='#further-results-on-cifar'>D<!-- tex4ht:ref: app:discount-ablations  --></a> we report some additional Cifar <span class='cite'>[<a href='#Xkrizhevsky2009learning'>21</a>]</span> experiments to verify that our
findings hold on a harder optimization landscape.
</p><!-- l. 124 --><p class='indent'>   <span class='cmbx-10'>Controlled factors. </span>The primary study uses
<!-- l. 125 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>n</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>30</mn></mrow></math></span> honest
nodes, mean aggregation, one local SGD step per round, and sampling fractions
<!-- l. 125 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>s</mi><mo class='MathClass-bin' stretchy='false'>∕</mo><mo class='MathClass-open' stretchy='false'>(</mo><mi>n</mi> <mo class='MathClass-bin' stretchy='false'>−</mo> <mn>1</mn><mo class='MathClass-close' stretchy='false'>)</mo> <mo class='MathClass-rel' stretchy='false'>∈</mo><mo class='MathClass-open' stretchy='false'>{</mo><mn>0.1</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>0.2</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mn>0.4</mn><mo class='MathClass-close' stretchy='false'>}</mo></mrow></math></span>.
FEMNIST runs for 1000 rounds, with batch size 64, SGD learning rate
<!-- l. 125 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>0.05</mn></mrow></math></span>, momentum
<!-- l. 125 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>0.9</mn></mrow></math></span>, and weight
decay <!-- l. 125 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>1</mn><msup><mrow><mn>0</mn></mrow><mrow><mo class='MathClass-bin' stretchy='false'>−</mo><mn>4</mn></mrow></msup></mrow></math></span>.
Validation is performed every 20 rounds. Each configuration is repeated over 3 seeds,
and the relevant metrics are averaged over these seeds, except for the clustering plots,
for visualization reasons.
</p><!-- l. 132 --><p class='indent'>   <span class='cmbx-10'>Metrics and fair comparison. </span>The primary endpoint is mean global
test accuracy at a fixed number of transmitted models. We also report the
worst-node accuracy and the communication required to reach a fixed target
accuracy. To explain outcomes, we measure model disagreement, consensus
drift, and probability mass assigned to same-cluster peers. Finally, we
report realized reward regret against the best fixed subset in hindsight:
<!-- l. 134 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msub><mrow><mi>R</mi></mrow><mrow><mi>i</mi></mrow></msub><mo class='MathClass-open' stretchy='false'>(</mo><mi>T</mi><mo class='MathClass-close' stretchy='false'>)</mo> <mo class='MathClass-punc' stretchy='false'>:</mo><mo class='MathClass-rel' stretchy='false'>=</mo><munder class='msub'><mrow><mi class='qopname'> max</mi><mo> ⁡<!-- FUNCTION APPLICATION --> </mo></mrow><mrow><mo class='MathClass-rel' stretchy='false'>|</mo><mi>S</mi><mo class='MathClass-rel' stretchy='false'>|</mo><mo class='MathClass-rel' stretchy='false'>=</mo><mi>s</mi></mrow></munder><msubsup><mrow><mi class='qopname'> ∑</mi><mo> ⁡<!-- FUNCTION APPLICATION --> </mo>
  <!-- nolimits --></mrow><mrow><mi>t</mi><mo class='MathClass-rel' stretchy='false'>=</mo><mn>1</mn></mrow><mrow><mi>T</mi></mrow></msubsup><msub><mrow><mover accent='true'><mrow><mi>r</mi></mrow><mo accent='true'>¯</mo></mover></mrow><mrow><mi>i</mi><mo class='MathClass-punc' stretchy='false'>,</mo><mi>S</mi><mo class='MathClass-punc' stretchy='false'>,</mo><mi>t</mi></mrow></msub> <mo class='MathClass-bin' stretchy='false'>−</mo><msubsup><mrow><mi class='qopname'>∑</mi><mo> ⁡<!-- FUNCTION APPLICATION --> </mo>
  <!-- nolimits --></mrow><mrow><mi>t</mi><mo class='MathClass-rel' stretchy='false'>=</mo><mn>1</mn></mrow><mrow><mi>T</mi></mrow></msubsup><msub><mrow><mover accent='true'><mrow><mi>r</mi></mrow><mo accent='true'>¯</mo></mover></mrow><mrow><mi>i</mi><mo class='MathClass-punc' stretchy='false'>,</mo><msubsup><mrow><mi>S</mi></mrow><mrow><mi>i</mi></mrow><mrow><mi>t</mi></mrow></msubsup><mo class='MathClass-punc' stretchy='false'>,</mo><mi>t</mi></mrow></msub><mo class='MathClass-punc' stretchy='false'>.</mo></mrow></math></span>
This diagnostic compares methods on the trajectory each method actually
created.
</p>
   <h3 class='sectionHead' id='results-and-discussion'><span class='titlemark'>IV. </span> <a id='x1-9000IV'></a>Results and Discussion</h3>
<!-- l. 144 --><p class='noindent'><span class='cmbx-10'>Does adaptation improve communication efficiency?</span>
</p><!-- l. 146 --><p class='indent'>   We report here a Pareto frontier, showing the personalization vs generalization
tradeoff between the various samplers. With less heterogeneity (3-5 clusters), the
uniform is Pareto-optimal, while it stops being so with 10 clusters. We investigate the
whole optimization process over the rounds, and we report these detailed plots in
Appendix <a href='#detailed-results-on-training-process'>C.2<!-- tex4ht:ref: app:detailed-results-femnist  --></a>. </p><figure class='figure' id='x1-9003r1'><span id='pareto-frontier-global-accuracy-vs-local-of-the-chosen-samplers-sampling-ratio-is-adapted-to-cluster-size-sampled-cluster-size-'></span>
<div class='subfigure'>
<!-- l. 150 --><p class='noindent'></p><!-- l. 152 --><p class='noindent'><img alt='PIC' src='report/figures/femnist-pathological-clusters/femnist_pareto.png' /> <a id='x1-9001r1'></a></p>
<div class='caption'><span class='id'><span class='cmr-9'>(a) </span></span><span class='content'><span class='cmr-9'>Local validation vs global test accuracy.</span></span></div></div> <div class='subfigure'>
<!-- l. 156 --><p class='noindent'></p><!-- l. 158 --><p class='noindent'><img alt='PIC' src='report/figures/femnist-pathological-clusters/femnist_loss_pareto.png' /> <a id='x1-9002r2'></a></p>
<div class='caption'><span class='id'><span class='cmr-9'>(b) </span></span><span class='content'><span class='cmr-9'>Local validation vs global test loss.</span>   </span></div></div>
<div class='caption'><span class='id'>Fig. 1:  </span><span class='content'>Pareto  frontier,  global  accuracy  vs  local,  of  the  chosen  samplers.
Sampling ratio is adapted to cluster size (sampled = cluster size + 1)
</span></div>
   </figure>
<!-- l. 167 --><p class='indent'>   <span class='cmbx-10'>Do bandits recover useful latent structure? </span>Figure <a href='#final-sampling-probabilities-for-pathological-and-dirichletbased-femnist-clusters'>2<!-- tex4ht:ref: fig:final-sampling-probabilities-femnist  --></a> shows the adaptive
samplers are in general capable of recovering the latent cluster structures. Comparing
with Figure <a href='#pareto-frontier-global-accuracy-vs-local-of-the-chosen-samplers-sampling-ratio-is-adapted-to-cluster-size-sampled-cluster-size-'>1<!-- tex4ht:ref: fig:pareto-sampler  --></a> we can see that the preference intensity is correlated with the
personalization-generalization tradeoff: CTS aggressively samples cluster
neighbors and has strong personalization but poor generalization, whereas EXP3
generalizes better, but loses on personalization. The uniform baseline has no
preference.
</p>
   <figure class='figure' id='x1-9008r2'><span id='final-sampling-probabilities-for-pathological-and-dirichletbased-femnist-clusters'></span>
<div class='subfigure'>
<!-- l. 180 --><p class='noindent'></p><!-- l. 182 --><p class='noindent'><img alt='PIC' src='report/figures/femnist-pathological-clusters/probabilities/cts-C5-cosine.png' /> <a id='x1-9004r1'></a>
</p>
<div class='caption'><span class='id'><span class='cmr-9'>(a) </span></span><span class='content'><span class='cmr-9'>CTS + COS, Pathological.</span>        </span></div></div>                                  <div class='subfigure'>
<!-- l. 186 --><p class='noindent'></p><!-- l. 188 --><p class='noindent'><img alt='PIC' src='report/figures/femnist-pathological-clusters/probabilities/exp3-C5-Cosine.png' /> <a id='x1-9005r2'></a></p>
<div class='caption'><span class='id'><span class='cmr-9'>(b) </span></span><span class='content'><span class='cmr-9'>EXP3 + COS, Pathological.</span>       </span></div></div>
<div class='subfigure'>
<!-- l. 194 --><p class='noindent'></p><!-- l. 196 --><p class='noindent'><img alt='PIC' src='report/figures/femnist-alpha-clusters/cts-cosine-c10-alpha10.png' /> <a id='x1-9006r3'></a></p>
<div class='caption'><span class='id'><span class='cmr-9'>(c)            </span></span><span class='content'><span class='cmr-9'>CTS            +            COS,</span>
<!-- l. 197 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>α</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>10</mn></mrow></math></span><span class='cmr-9'>.</span></span></div></div>                                  <div class='subfigure'>
<!-- l. 200 --><p class='noindent'></p><!-- l. 202 --><p class='noindent'><img alt='PIC' src='report/figures/femnist-alpha-clusters/cts-cosine-c10-alpha05.png' /> <a id='x1-9007r4'></a></p>
<div class='caption'><span class='id'><span class='cmr-9'>(d)           </span></span><span class='content'><span class='cmr-9'>CTS           +           COS,</span>
<!-- l. 203 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>α</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>0.5</mn></mrow></math></span><span class='cmr-9'>.</span></span></div></div>
<div class='caption'><span class='id'>Fig. 2:  </span><span class='content'>Final  sampling  probabilities  for  pathological-  and  Dirichlet-based
FEMNIST clusters.
</span></div>
   </figure>
<!-- l. 210 --><p class='indent'>   <span class='cmbx-10'>How well does reward proxy the optimization target?  </span>The reward signal
drives the bandit algorithm’s sampling choices, so it is natural to ask whether the
rewards align with the optimization objective.
</p><!-- l. 214 --><p class='indent'>   Table <a href='#how-often-cos-improves-over-imd-in-paired-adaptive-configurations-on-pathological-femnist-results-are-averaged-over-network-configurations-clusters-sampling-label-distribution'>I<!-- tex4ht:ref: tab:reward-counts  --></a> shows a clear split: COS is a better proxy for personalization, whereas
IMD better preserves generalization. Switching from IMD to COS improves local
accuracy in 16 of 18 pathological configurations, but degrades global accuracy in 15
of 18. The loss metrics tell the same story: COS lowers local loss in 16 of 18 cases,
but lowers global loss in only 4. The reward comparison histograms in Fig. <a href='#effect-of-changing-the-reward-from-imd-to-cos-positive-accuracy-values-favor-cos-negative-loss-values-are-better-cos-improves-local-performance-when-heterogeneity-is-strong-but-sacrifices-global-performance'>4<!-- tex4ht:ref: fig:reward-gap-histograms  --></a> show
the magnitude: COS usually moves the operating point toward higher local accuracy
and lower local loss, at the cost of lower global accuracy and higher global
loss.
</p><!-- l. 216 --><p class='indent'>   This behavior is expected: COS scores the direction of a node’s update, so it better
reflects local task similarity and encourages same-cluster sampling. IMD instead favors
nearby models, which keeps more cross-cluster mixing and therefore better preserves
global accuracy. Figure <a href='#exp-sampling-on-the-pathologicalcluster-c-femnist-run-with-imd-vs-cos-reward-we-can-see-that-cos-drives-the-algorithm-to-be-more-aggressive-towards-sampling-incluster-neighbors'>6<!-- tex4ht:ref: fig:exp3-imd-vs-cos-c5  --></a> illustrates this mechanism for EXP3. The alpha-cluster
sweep confirms that the COS advantage weakens as heterogeneity decreases. At
<!-- l. 216 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>α</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>0.5</mn></mrow></math></span>, COS
improves local accuracy in 16 of 18 paired configurations and improves global accuracy in only
5 of 18. At <!-- l. 216 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>α</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>10</mn></mrow></math></span>,
the effect essentially disappears: local accuracy improves in 10 of
18 cases, global accuracy in 8 of 18, and the mean changes are below
<!-- l. 216 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>0.1</mn></mrow></math></span>
percentage points. Thus COS is better than IMD as a proxy for personalization when
a stable cluster structure exists; it is not a universal proxy for global optimization.
Appendix <a href='#rewards-and-samplers'>C.1<!-- tex4ht:ref: app:rewards-samplers  --></a> gives the full breakdown.
</p>
   <div class='table'>
<!-- l. 218 --><p class='indent'>   </p><figure class='float' id='x1-9009r1'><span id='how-often-cos-improves-over-imd-in-paired-adaptive-configurations-on-pathological-femnist-results-are-averaged-over-network-configurations-clusters-sampling-label-distribution'></span>
<figcaption class='caption'><span class='id'>TABLE I: </span><span class='content'>How often COS improves over IMD in paired adaptive configurations
on pathological FEMNIST. Results are averaged over network configurations
(clusters + sampling + label distribution)                               </span></figcaption><!-- tex4ht:label?: x1-9009r1  -->
<div class='tabular'>
 <table class='tabular' id='TBL-2'><colgroup id='TBL-2-1g'><col id='TBL-2-1' /><col id='TBL-2-2' /><col id='TBL-2-3' /><col id='TBL-2-4' /><col id='TBL-2-5' /></colgroup><tr id='TBL-2-1-' style='vertical-align:baseline;'><td class='td01' id='TBL-2-1-1' style='text-align:left; white-space:nowrap;'><span class='cmr-9'>Split                                                                                                           </span></td><td class='td11' id='TBL-2-1-2' style='text-align:left; white-space:nowrap;'> <span class='cmr-9'>Metric        </span></td><td class='td11' id='TBL-2-1-3' style='text-align:center; white-space:nowrap;'> <span class='cmr-9'>Improves  </span></td><td class='td11' id='TBL-2-1-4' style='text-align:center; white-space:nowrap;'> <span class='cmr-9'>Worsens  </span></td><td class='td10' id='TBL-2-1-5' style='text-align:center; white-space:nowrap;'> <span class='cmr-9'>Mean </span><!-- l. 225 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi mathvariant='normal'>Δ</mi></math></span></td>
</tr><tr id='TBL-2-2-' style='vertical-align:baseline;'><td class='td01' id='TBL-2-2-1' style='text-align:left; white-space:nowrap;'><span class='cmr-9'>Pathological                                                                                                  </span></td><td class='td11' id='TBL-2-2-2' style='text-align:left; white-space:nowrap;'> <span class='cmr-9'>Local acc.    </span></td><td class='td11' id='TBL-2-2-3' style='text-align:center; white-space:nowrap;'>   <span class='cmr-9'>16/18    </span></td><td class='td11' id='TBL-2-2-4' style='text-align:center; white-space:nowrap;'>   <span class='cmr-9'>2/18    </span></td><td class='td10' id='TBL-2-2-5' style='text-align:center; white-space:nowrap;'>  <!-- l. 227 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-bin' stretchy='false'>+</mo> <mn>1.60</mn></mrow></math></span> <span class='cmr-9'>pts  </span></td>
</tr><tr id='TBL-2-3-' style='vertical-align:baseline;'><td class='td01' id='TBL-2-3-1' style='text-align:left; white-space:nowrap;'><span class='cmr-9'>Pathological                                                                                                  </span></td><td class='td11' id='TBL-2-3-2' style='text-align:left; white-space:nowrap;'> <span class='cmr-9'>Global acc.  </span></td><td class='td11' id='TBL-2-3-3' style='text-align:center; white-space:nowrap;'>   <span class='cmr-9'>3/18     </span></td><td class='td11' id='TBL-2-3-4' style='text-align:center; white-space:nowrap;'>  <span class='cmr-9'>15/18    </span></td><td class='td10' id='TBL-2-3-5' style='text-align:center; white-space:nowrap;'>  <!-- l. 228 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-bin' stretchy='false'>−</mo><mn>6.84</mn></mrow></math></span> <span class='cmr-9'>pts  </span></td>
</tr><tr id='TBL-2-4-' style='vertical-align:baseline;'><td class='td01' id='TBL-2-4-1' style='text-align:left; white-space:nowrap;'><span class='cmr-9'>Pathological                                                                                                  </span></td><td class='td11' id='TBL-2-4-2' style='text-align:left; white-space:nowrap;'> <span class='cmr-9'>Local loss    </span></td><td class='td11' id='TBL-2-4-3' style='text-align:center; white-space:nowrap;'>   <span class='cmr-9'>16/18    </span></td><td class='td11' id='TBL-2-4-4' style='text-align:center; white-space:nowrap;'>   <span class='cmr-9'>2/18    </span></td><td class='td10' id='TBL-2-4-5' style='text-align:center; white-space:nowrap;'>    <!-- l. 229 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-bin' stretchy='false'>−</mo><mn>0.047</mn></mrow></math></span>    </td>
</tr><tr id='TBL-2-5-' style='vertical-align:baseline;'><td class='td01' id='TBL-2-5-1' style='text-align:left; white-space:nowrap;'><span class='cmr-9'>Pathological                                                                                                  </span></td><td class='td11' id='TBL-2-5-2' style='text-align:left; white-space:nowrap;'> <span class='cmr-9'>Global loss  </span></td><td class='td11' id='TBL-2-5-3' style='text-align:center; white-space:nowrap;'>   <span class='cmr-9'>4/18     </span></td><td class='td11' id='TBL-2-5-4' style='text-align:center; white-space:nowrap;'>  <span class='cmr-9'>14/18    </span></td><td class='td10' id='TBL-2-5-5' style='text-align:center; white-space:nowrap;'>    <!-- l. 230 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-bin' stretchy='false'>+</mo> <mn>0.376</mn></mrow></math></span>    </td>
</tr><tr id='TBL-2-6-' style='vertical-align:baseline;'><td class='td01' id='TBL-2-6-1' style='text-align:left; white-space:nowrap;'><!-- l. 232 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>α</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>0.5</mn></mrow></math></span>  </td><td class='td11' id='TBL-2-6-2' style='text-align:left; white-space:nowrap;'> <span class='cmr-9'>Local acc.    </span></td><td class='td11' id='TBL-2-6-3' style='text-align:center; white-space:nowrap;'>   <span class='cmr-9'>16/18    </span></td><td class='td11' id='TBL-2-6-4' style='text-align:center; white-space:nowrap;'>   <span class='cmr-9'>2/18    </span></td><td class='td10' id='TBL-2-6-5' style='text-align:center; white-space:nowrap;'>  <!-- l. 232 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-bin' stretchy='false'>+</mo> <mn>0.72</mn></mrow></math></span> <span class='cmr-9'>pts  </span></td>
</tr><tr id='TBL-2-7-' style='vertical-align:baseline;'><td class='td01' id='TBL-2-7-1' style='text-align:left; white-space:nowrap;'><!-- l. 233 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>α</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>0.5</mn></mrow></math></span>  </td><td class='td11' id='TBL-2-7-2' style='text-align:left; white-space:nowrap;'> <span class='cmr-9'>Global acc.  </span></td><td class='td11' id='TBL-2-7-3' style='text-align:center; white-space:nowrap;'>   <span class='cmr-9'>5/18     </span></td><td class='td11' id='TBL-2-7-4' style='text-align:center; white-space:nowrap;'>  <span class='cmr-9'>13/18    </span></td><td class='td10' id='TBL-2-7-5' style='text-align:center; white-space:nowrap;'>  <!-- l. 233 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-bin' stretchy='false'>−</mo><mn>1.32</mn></mrow></math></span> <span class='cmr-9'>pts  </span></td>
</tr><tr id='TBL-2-8-' style='vertical-align:baseline;'><td class='td01' id='TBL-2-8-1' style='text-align:left; white-space:nowrap;'><!-- l. 234 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>α</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>10</mn></mrow></math></span>  </td><td class='td11' id='TBL-2-8-2' style='text-align:left; white-space:nowrap;'> <span class='cmr-9'>Local acc.    </span></td><td class='td11' id='TBL-2-8-3' style='text-align:center; white-space:nowrap;'>   <span class='cmr-9'>10/18    </span></td><td class='td11' id='TBL-2-8-4' style='text-align:center; white-space:nowrap;'>   <span class='cmr-9'>8/18    </span></td><td class='td10' id='TBL-2-8-5' style='text-align:center; white-space:nowrap;'>  <!-- l. 234 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-bin' stretchy='false'>+</mo> <mn>0.03</mn></mrow></math></span> <span class='cmr-9'>pts  </span></td>
</tr><tr id='TBL-2-9-' style='vertical-align:baseline;'><td class='td01' id='TBL-2-9-1' style='text-align:left; white-space:nowrap;'><!-- l. 235 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>α</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>10</mn></mrow></math></span>  </td><td class='td11' id='TBL-2-9-2' style='text-align:left; white-space:nowrap;'> <span class='cmr-9'>Global acc.  </span></td><td class='td11' id='TBL-2-9-3' style='text-align:center; white-space:nowrap;'>   <span class='cmr-9'>8/18     </span></td><td class='td11' id='TBL-2-9-4' style='text-align:center; white-space:nowrap;'>  <span class='cmr-9'>10/18    </span></td><td class='td10' id='TBL-2-9-5' style='text-align:center; white-space:nowrap;'>  <!-- l. 235 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-bin' stretchy='false'>−</mo><mn>0.06</mn></mrow></math></span> <span class='cmr-9'>pts  </span></td>
</tr></table>                                                                                                            </div>
   </figure>
   </div>
<!-- l. 240 --><p class='indent'>   <span class='cmbx-10'>When does discounting fail?</span>
</p><!-- l. 242 --><p class='indent'>   While the reward decides which peers look useful, the discount factor decides how
long evidence about those peers is remembered. In our static-cluster setting, useful
peers are persistent: a node’s cluster identity does not change during training.
Undiscounted CTS and CUCB can therefore accumulate evidence about same-cluster
neighbors, while discounted variants down-weight that evidence and relax the
sampling distribution toward broader mixing.
</p><!-- l. 259 --><p class='indent'>   The results supporting these claims are in Table <a href='#discounted-vs-nondiscounted-samplers-under-the-imd-reward-nodes-cifar-pathological-gc-heterogeneity-rounds-seed-values-are-trajectory-averages-over-rounds-and-nodes-same-reduction-as-the-heatmaps-is-nondiscounted-best-per-column-in-bold'>II<!-- tex4ht:ref: tab:paramdist  --></a>, with a CIFAR ablation. Under IMD,
decreasing <!-- l. 259 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>γ</mi></math></span>
from 1 to 0.9 lowers trajectory-averaged local accuracy from
<!-- l. 259 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>58</mn><mo class='MathClass-punc' stretchy='false'>.</mo><mn>1</mn><mi>%</mi></mrow></math></span> to
<!-- l. 259 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>33</mn><mo class='MathClass-punc' stretchy='false'>.</mo><mn>7</mn><mi>%</mi></mrow></math></span> for CTS
and from <!-- l. 259 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>44</mn><mo class='MathClass-punc' stretchy='false'>.</mo><mn>4</mn><mi>%</mi></mrow></math></span>
to <!-- l. 259 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>26</mn><mo class='MathClass-punc' stretchy='false'>.</mo><mn>9</mn><mi>%</mi></mrow></math></span>
for CUCB, while moving the sampling graph closer to uniform (Fig. <a href='#comparison-of-cts-probabilities-for-different-discount-factors-final-round-imd-reward-the-result-of-discounting-is-that-the-final-distribution-is-closer-to-a-uniform-and-thus-less-accurately-identifies-the-clusters'>9<!-- tex4ht:ref: fig:cts-cluster-discount-comparison  --></a>, see
Appendix <a href='#further-results-on-cifar'>D<!-- tex4ht:ref: app:discount-ablations  --></a>).
</p>
   <div class='table'>
<!-- l. 261 --><p class='indent'>   </p><figure class='float' id='x1-9010r2'><span id='discounted-vs-nondiscounted-samplers-under-the-imd-reward-nodes-cifar-pathological-gc-heterogeneity-rounds-seed-values-are-trajectory-averages-over-rounds-and-nodes-same-reduction-as-the-heatmaps-is-nondiscounted-best-per-column-in-bold'></span>
<figcaption class='caption'><span class='id'>TABLE II: </span><span class='content'>Discounted vs. non-discounted samplers under the IMD reward. 30
nodes, CIFAR-10, pathological 5g/2c heterogeneity, 500 rounds, seed 0. Values
are trajectory averages over rounds and nodes (same reduction as the heatmaps).
<!-- l. 263 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msup><mrow></mrow><mrow><mo class='MathClass-bin' stretchy='false'>†</mo></mrow></msup></math></span><!-- l. 263 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>γ</mi><mo class='MathClass-rel' stretchy='false'>=</mo><mn>1.0</mn></mrow></math></span>
is non-discounted. Best per column in <span class='cmbx-10'>bold</span>.                             </span></figcaption><!-- tex4ht:label?: x1-9010r2  -->
<div class='tabular'>
 <table class='tabular' id='TBL-3'><colgroup id='TBL-3-1g'><col id='TBL-3-1' /><col id='TBL-3-2' /><col id='TBL-3-3' /><col id='TBL-3-4' /><col id='TBL-3-5' /><col id='TBL-3-6' /></colgroup><tr id='TBL-3-1-' style='vertical-align:baseline;'><td class='td11' id='TBL-3-1-1' style='text-align:left; white-space:nowrap;'> Sampler  </td><td class='td11' id='TBL-3-1-2' style='text-align:left; white-space:nowrap;'> <!-- l. 267 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>γ</mi></math></span>  </td><td class='td11' id='TBL-3-1-3' style='text-align:center; white-space:nowrap;'> Val. Acc <!-- l. 267 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow> <mi>↑</mi></mrow></math></span> </td><td class='td11' id='TBL-3-1-4' style='text-align:center; white-space:nowrap;'> Global Acc <!-- l. 267 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow> <mi>↑</mi></mrow></math></span> </td><td class='td11' id='TBL-3-1-5' style='text-align:center; white-space:nowrap;'> Val. Loss <!-- l. 267 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow> <mi>↓</mi></mrow></math></span> </td><td class='td11' id='TBL-3-1-6' style='text-align:center; white-space:nowrap;'> Regret <!-- l. 267 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow> <mi>↓</mi></mrow></math></span> </td>
</tr><tr id='TBL-3-2-' style='vertical-align:baseline;'><td class='td11' id='TBL-3-2-1' style='text-align:left; white-space:nowrap;'> CUCB     </td><td class='td11' id='TBL-3-2-2' style='text-align:left; white-space:nowrap;'> <!-- l. 269 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>1</mn><mo class='MathClass-punc' stretchy='false'>.</mo><msup><mrow><mn>0</mn></mrow><mrow><mo class='MathClass-bin' stretchy='false'>†</mo></mrow></msup></mrow></math></span> </td><td class='td11' id='TBL-3-2-3' style='text-align:center; white-space:nowrap;'>                                    <span class='cmbx-10'>0.444                                                 </span></td><td class='td11' id='TBL-3-2-4' style='text-align:center; white-space:nowrap;'>                                     0.111                                                          </td><td class='td11' id='TBL-3-2-5' style='text-align:center; white-space:nowrap;'>                                    1.312                                                         </td><td class='td11' id='TBL-3-2-6' style='text-align:center; white-space:nowrap;'>                                   <span class='cmbx-10'>24.7                                                </span></td></tr><tr id='TBL-3-3-' style='vertical-align:baseline;'><td class='td11' id='TBL-3-3-1' style='text-align:left; white-space:nowrap;'> </td><td class='td11' id='TBL-3-3-2' style='text-align:left; white-space:nowrap;'> 0.99 </td><td class='td11' id='TBL-3-3-3' style='text-align:center; white-space:nowrap;'> 0.367 </td><td class='td11' id='TBL-3-3-4' style='text-align:center; white-space:nowrap;'> 0.119 </td><td class='td11' id='TBL-3-3-5' style='text-align:center; white-space:nowrap;'> 1.685 </td><td class='td11' id='TBL-3-3-6' style='text-align:center; white-space:nowrap;'> 31.2</td>
</tr><tr id='TBL-3-4-' style='vertical-align:baseline;'><td class='td11' id='TBL-3-4-1' style='text-align:left; white-space:nowrap;'>          </td><td class='td11' id='TBL-3-4-2' style='text-align:left; white-space:nowrap;'> 0.95                                                                                                    </td><td class='td11' id='TBL-3-4-3' style='text-align:center; white-space:nowrap;'>                                    0.253                                                        </td><td class='td11' id='TBL-3-4-4' style='text-align:center; white-space:nowrap;'>                                     0.130                                                          </td><td class='td11' id='TBL-3-4-5' style='text-align:center; white-space:nowrap;'>                                    2.065                                                         </td><td class='td11' id='TBL-3-4-6' style='text-align:center; white-space:nowrap;'>                                   37.5                                                        </td></tr><tr id='TBL-3-5-' style='vertical-align:baseline;'><td class='td11' id='TBL-3-5-1' style='text-align:left; white-space:nowrap;'> </td><td class='td11' id='TBL-3-5-2' style='text-align:left; white-space:nowrap;'> 0.9 </td><td class='td11' id='TBL-3-5-3' style='text-align:center; white-space:nowrap;'> 0.269 </td><td class='td11' id='TBL-3-5-4' style='text-align:center; white-space:nowrap;'> <span class='cmbx-10'>0.155 </span></td><td class='td11' id='TBL-3-5-5' style='text-align:center; white-space:nowrap;'> 1.986 </td><td class='td11' id='TBL-3-5-6' style='text-align:center; white-space:nowrap;'> 37.4</td>
</tr><tr id='TBL-3-6-' style='vertical-align:baseline;'><td class='td11' id='TBL-3-6-1' style='text-align:left; white-space:nowrap;'> CTS       </td><td class='td11' id='TBL-3-6-2' style='text-align:left; white-space:nowrap;'> <!-- l. 274 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>1</mn><mo class='MathClass-punc' stretchy='false'>.</mo><msup><mrow><mn>0</mn></mrow><mrow><mo class='MathClass-bin' stretchy='false'>†</mo></mrow></msup></mrow></math></span> </td><td class='td11' id='TBL-3-6-3' style='text-align:center; white-space:nowrap;'>                                    <span class='cmbx-10'>0.581                                                 </span></td><td class='td11' id='TBL-3-6-4' style='text-align:center; white-space:nowrap;'>                                    <span class='cmbx-10'>0.132                                                  </span></td><td class='td11' id='TBL-3-6-5' style='text-align:center; white-space:nowrap;'>                                    <span class='cmbx-10'>1.013                                                 </span></td><td class='td11' id='TBL-3-6-6' style='text-align:center; white-space:nowrap;'>                                   <span class='cmbx-10'>15.9                                                </span></td>
</tr><tr id='TBL-3-7-' style='vertical-align:baseline;'><td class='td11' id='TBL-3-7-1' style='text-align:left; white-space:nowrap;'>          </td><td class='td11' id='TBL-3-7-2' style='text-align:left; white-space:nowrap;'> 0.99                                                                                                    </td><td class='td11' id='TBL-3-7-3' style='text-align:center; white-space:nowrap;'>                                    0.550                                                        </td><td class='td11' id='TBL-3-7-4' style='text-align:center; white-space:nowrap;'>                                     0.127                                                          </td><td class='td11' id='TBL-3-7-5' style='text-align:center; white-space:nowrap;'>                                    1.073                                                         </td><td class='td11' id='TBL-3-7-6' style='text-align:center; white-space:nowrap;'>                                   18.9                                                        </td>
</tr><tr id='TBL-3-8-' style='vertical-align:baseline;'><td class='td11' id='TBL-3-8-1' style='text-align:left; white-space:nowrap;'>          </td><td class='td11' id='TBL-3-8-2' style='text-align:left; white-space:nowrap;'> 0.95                                                                                                    </td><td class='td11' id='TBL-3-8-3' style='text-align:center; white-space:nowrap;'>                                    0.393                                                        </td><td class='td11' id='TBL-3-8-4' style='text-align:center; white-space:nowrap;'>                                     0.119                                                          </td><td class='td11' id='TBL-3-8-5' style='text-align:center; white-space:nowrap;'>                                    1.507                                                         </td><td class='td11' id='TBL-3-8-6' style='text-align:center; white-space:nowrap;'>                                   30.2                                                        </td>
</tr><tr id='TBL-3-9-' style='vertical-align:baseline;'><td class='td11' id='TBL-3-9-1' style='text-align:left; white-space:nowrap;'>          </td><td class='td11' id='TBL-3-9-2' style='text-align:left; white-space:nowrap;'> 0.9                                                                                                     </td><td class='td11' id='TBL-3-9-3' style='text-align:center; white-space:nowrap;'>                                    0.337                                                        </td><td class='td11' id='TBL-3-9-4' style='text-align:center; white-space:nowrap;'>                                     0.126                                                          </td><td class='td11' id='TBL-3-9-5' style='text-align:center; white-space:nowrap;'>                                    1.773                                                         </td><td class='td11' id='TBL-3-9-6' style='text-align:center; white-space:nowrap;'>                                   35.7                                                        </td>
</tr></table>                                                                                                                                                                                                                                                                                                                                                                                               </div>
   </figure>
   </div>
   <h3 class='sectionHead' id='conclusion'><span class='titlemark'>V. </span> <a id='x1-10000V'></a>Conclusion</h3>
<!-- l. 312 --><p class='noindent'>We studied adaptive neighbor sampling for decentralized learning under
heterogeneous data, formulating peer selection as a combinatorial semi-bandit. Our
results show that bandit samplers can recover latent cluster structure, but this does
not always translate into better global performance. In particular, CTS strongly
favors same-cluster peers and improves personalization, while EXP3 and uniform
sampling often provide better generalization through broader mixing. We
also find that the reward signal determines the operating point: COS is
better aligned with local personalization, whereas IMD is more favorable for
global performance. Finally, discounting weakens cluster recovery in our static
setting, acting as a memory–adaptation trade-off rather than a universal
improvement.
</p><!-- l. 314 --><p class='indent'>   Overall, adaptive sampling is most useful when the goal is personalized learning
under persistent heterogeneity, and it can be tuned to reach intermediate
personalization-generalization tradeoffs, while uniform sampling remains a strong
baseline for generalization.
</p><!-- l. 338 --><p class='indent'>
</p>
   <h3 class='likesectionHead' id='references'><a id='x1-11000'></a>References</h3>
<!-- l. 340 --><p class='noindent'>
   </p><div class='thebibliography'>
   <p class='bibitem'><span class='biblabel'>
 [1]<span class='bibsp'>   </span></span><a id='Xafind'></a>Smart  Sampling:  Helping  from  Friendly  Neighbors  for  Decentralized
   Federated Learning. <a class='url' href='https://arxiv.org/pdf/2407.04460'><span class='cmtt-10'>https://arxiv.org/pdf/2407.04460</span></a>.
   </p>
   <p class='bibitem'><span class='biblabel'>
 [2]<span class='bibsp'>   </span></span><a id='Xdfeddc'></a>DFL                                                                                  with
   Dynamic Neighbor Selection and Confidence-Based Aggregation (DFedDC).
   <a class='url' href='https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5560620'><span class='cmtt-10'>https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5560620</span></a>.
   </p>
   <p class='bibitem'><span class='biblabel'>
 [3]<span class='bibsp'>   </span></span><a id='Xrpel'></a>Robust      and      Efficient      Collaborative      Learning      (RPEL).
   <a class='url' href='https://arxiv.org/pdf/2510.08311'><span class='cmtt-10'>https://arxiv.org/pdf/2510.08311</span></a>.
   </p>
   <p class='bibitem'><span class='biblabel'>
 [4]<span class='bibsp'>   </span></span>
   <a id='Xfedaaw'></a>FL with Adaptive Aggregation Weights for Non-IID Data in Edge Networks
   (FedAAW). <a class='url' href='https://ieeexplore.ieee.org/document/10854512'><span class='cmtt-10'>https://ieeexplore.ieee.org/document/10854512</span></a>.
   </p>
   <p class='bibitem'><span class='biblabel'>
 [5]<span class='bibsp'>   </span></span><a id='Xkallet04methods'></a>Richard H. Kallet, “How to Write the Methods Section of a Research
   Paper,” <span class='cmti-10'>Respiratory Care</span>, vol. 49, no. 10, pp. 1229–1232, 2004.
   </p>
   <p class='bibitem'><span class='biblabel'>
 [6]<span class='bibsp'>   </span></span><a id='Xmcmahan2023communicationefficientlearningdeepnetworks'></a>H. Brendan McMahan, Eider Moore, Daniel Ramage, Seth Hampson,
   and  Blaise  Ag”uera  y  Arcas,  “Communication-Efficient  Learning  of
   Deep   Networks   from   Decentralized   Data,”   arXiv:1602.05629,   2023.
   <a class='url' href='https://arxiv.org/abs/1602.05629'><span class='cmtt-10'>https://arxiv.org/abs/1602.05629</span></a>.
   </p>
   <p class='bibitem'><span class='biblabel'>
 [7]<span class='bibsp'>   </span></span><a id='Xanderson04'></a>Greg    Anderson,    “How    to    Write    a    Paper    in    Scientific
   Journal       Style       and       Format,”       Bates       College,       2004.
   <a class='url' href='http://abacus.bates.edu/~ganderso/biology/resources/writing/HTWtoc.html'><span class='cmtt-10'>http://abacus.bates.edu/~ganderso/biology/resources/writing/HTWtoc.html</span></a>.
   </p>
   <p class='bibitem'><span class='biblabel'>
 [8]<span class='bibsp'>   </span></span><a id='Xjones08'></a>Simon Peyton Jones, “How to Write a Great Research Paper,” Microsoft
   Research Cambridge, 2008.
   </p>
   <p class='bibitem'><span class='biblabel'>
 [9]<span class='bibsp'>   </span></span><a id='Xeditor10'></a>Editorial, “Scientific Writing 101,” <span class='cmti-10'>Nature Structural Molecular Biology</span>,
   vol. 17, p. 139, 2010.
   </p>
   <p class='bibitem'><span class='biblabel'>
 [10]<span class='bibsp'>   </span></span><a id='Xwavelab'></a>Jonathan   B.   Buckheit   and   David   L.   Donoho,   “WaveLab   and
   Reproducible Research,” Stanford University, Tech. Rep., 2009.
   </p>
   <p class='bibitem'><span class='biblabel'>
 [11]<span class='bibsp'>   </span></span><a id='Xgentleman05'></a>Robert  Gentleman,  “Reproducible  Research:  A  Bioinformatics  Case
   Study,” <span class='cmti-10'>Statistical Applications in Genetics and Molecular Biology</span>, vol. 4,
   no. 1, 2005. <a class='url' href='http://www.bepress.com/sagmb/vol4/iss1/art2'><span class='cmtt-10'>http://www.bepress.com/sagmb/vol4/iss1/art2</span></a>.
   </p>
   <p class='bibitem'><span class='biblabel'>
 [12]<span class='bibsp'>   </span></span><a id='Xschwab00'></a>Matthias Schwab, Martin Karrenbach, and Jon Claerbout, “Making
   Scientific Computations Reproducible,” <span class='cmti-10'>Computing in Science Engineering</span>,
   vol. 2, no. 6, pp. 61–67, 2000. <a class='url' href='https://doi.org/10.1109/5992.881708'><span class='cmtt-10'>https://doi.org/10.1109/5992.881708</span></a>.
   </p>
   <p class='bibitem'><span class='biblabel'>
 [13]<span class='bibsp'>   </span></span><a id='Xspolsky04software'></a>Joel Spolsky, <span class='cmti-10'>Joel on Software: And on Diverse Occasionally Related
   Matters That Will Prove of Interest etc..: And on Diverse and Occasionally
   Related  Matters  ...  or  Ill-Luck,  Work  with  Them  in  Some  Capacity</span>.
   APRESS, 2004.
   </p>
   <p class='bibitem'><span class='biblabel'>
 [14]<span class='bibsp'>   </span></span><a id='Xhunt99pragmatic'></a>Andrew  Hunt  and  David  Thomas,  <span class='cmti-10'>The  Pragmatic  Programmer</span>.
   Addison Wesley, 1999.
   </p>
   <p class='bibitem'><span class='biblabel'>
 [15]<span class='bibsp'>   </span></span><a id='Xkrizhevsky2009learning'></a>Alex    Krizhevsky,    “Learning    Multiple    Layers    of    Features
   from   Tiny   Images,”   University   of   Toronto,   Tech.   Rep.,   2009.
   <a class='url' href='https://www.cs.toronto.edu/~kriz/learning-features-2009-TR.pdf'><span class='cmtt-10'>https://www.cs.toronto.edu/~kriz/learning-features-2009-TR.pdf</span></a>.
   </p>
   <p class='bibitem'><span class='biblabel'>
 [16]<span class='bibsp'>   </span></span><a id='Xauer2002nonstochastic'></a>P. Auer,  N. Cesa-Bianchi,  Y. Freund,  and  R. E.  Schapire,  “The
   nonstochastic multiarmed bandit problem,” <span class='cmti-10'>SIAM Journal on Computing</span>,
   vol. 32, no. 1, pp. 48–77, 2002.
   </p>
   <p class='bibitem'><span class='biblabel'>
 [17]<span class='bibsp'>   </span></span><a id='Xchen2013combinatorial'></a>W. Chen,   Y. Wang,   and   Y. Yuan,   “Combinatorial   multi-armed
   bandit: General framework and applications,” in <span class='cmti-10'>International Conference
   on Machine Learning (ICML)</span>, 2013, pp. 151–159.
   </p>
   <p class='bibitem'><span class='biblabel'>
 [18]<span class='bibsp'>   </span></span><a id='Xhuyuk2018cts'></a>A. Huyuk      and      C. Tekin,      “Analysis      of      combinatorial
   Thompson sampling for combinatorial multi-armed bandit problems,” <span class='cmti-10'>IEEE
   Transactions on Signal Processing</span>, vol. 67, no. 4, pp. 933–948, 2018.
   </p>
   <p class='bibitem'><span class='biblabel'>
 [19]<span class='bibsp'>   </span></span><a id='Xgarivier2011ucb'></a>A. Garivier and E. Moulines, “On upper-confidence bound policies for
   non-stationary bandit problems,” <span class='cmti-10'>arXiv preprint arXiv:0805.3415</span>, 2011.
   </p>
   <p class='bibitem'><span class='biblabel'>
 [20]<span class='bibsp'>   </span></span><a id='Xcaldas2018leaf'></a>S. Caldas, S. M. K. P. Wu, T. Li, J. Konečný, H. B. McMahan,
   V. Smith, and A. Talwalkar, “LEAF: A benchmark for federated settings,”
   <span class='cmti-10'>arXiv preprint arXiv:1812.01097</span>, 2018.
   </p>
   <p class='bibitem'><span class='biblabel'>
 [21]<span class='bibsp'>   </span></span><a id='Xkrizhevsky2009learning'></a>A. Krizhevsky, “Learning multiple layers of features from tiny images,”
   University of Toronto, Tech. Rep., 2009.
</p>
   </div>
<!-- l. 441 --><p class='indent'>
</p>
   <h3 class='sectionHead' id='implementation-details'><span class='titlemark'>APPENDIX A </span> <a id='x1-12000A'></a>Implementation details</h3>
   <h4 class='subsectionHead' id='model-details'><span class='titlemark'>A.1   </span> <a id='x1-13000A.1'></a>Model details</h4>
<!-- l. 51 --><p class='noindent'>All convolutional networks use ReLU activations, max-pooling, and SGD training.
See Table <a href='#neural-network-architectures-used-for-each-dataset'>III<!-- tex4ht:ref: tab:architectures  --></a>. For CIFAR-10, convolutions use same padding and max-pooling is
applied after each block.
</p>
   <h4 class='subsectionHead' id='sampling-details'><span class='titlemark'>A.2   </span> <a id='x1-14000A.2'></a>Sampling details</h4>
<!-- l. 56 --><p class='noindent'>All experiments use <!-- l. 56 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>m</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>30</mn></mrow></math></span> clients.
Each client samples <!-- l. 57 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>k</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mo class='MathClass-open' stretchy='false'>⌊</mo><mn>0.2</mn> <mo class='MathClass-bin' stretchy='false'>×</mo> <mn>30</mn><mo class='MathClass-close' stretchy='false'>⌋</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>6</mn></mrow></math></span>
neighbors per round (20% sampling budget), unless otherwise specified. Local steps per
round: <!-- l. 58 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>τ</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>1</mn></mrow></math></span>
(a single local SGD step before aggregation).
</p>
   <h4 class='subsectionHead' id='optimization-details-communication-rounds'><span class='titlemark'>A.3   </span> <a id='x1-15000A.3'></a>Optimization details, communication rounds</h4>
<!-- l. 62 --><p class='noindent'>For FEMNIST: SGD with momentum <!-- l. 62 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>0.9</mn></mrow></math></span>,
learning rate <!-- l. 62 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>0.05</mn></mrow></math></span>,
weight decay <!-- l. 62 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>1</mn><msup><mrow><mn>0</mn></mrow><mrow><mo class='MathClass-bin' stretchy='false'>−</mo><mn>4</mn></mrow></msup></mrow></math></span>,
batch size <!-- l. 62 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>25</mn></mrow></math></span>,
NLL loss, <!-- l. 62 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>1000</mn></mrow></math></span>
communication rounds. For CIFAR-10: SGD with momentum
<!-- l. 63 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>0.99</mn></mrow></math></span>, learning
rate <!-- l. 63 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>0.5</mn></mrow></math></span>, weight
decay <!-- l. 63 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>1</mn><msup><mrow><mn>0</mn></mrow><mrow><mo class='MathClass-bin' stretchy='false'>−</mo><mn>2</mn></mrow></msup></mrow></math></span>,
batch size <!-- l. 64 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>50</mn></mrow></math></span>,
CrossEntropyLoss, <!-- l. 64 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>500</mn></mrow></math></span>
communication rounds.
</p>
   <h4 class='subsectionHead' id='evaluation-details-metrics'><span class='titlemark'>A.4   </span> <a id='x1-16000A.4'></a>Evaluation details, metrics</h4>
<!-- l. 68 --><p class='noindent'>The global test set is a <!-- l. 68 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>10</mn><mi>%</mi></mrow></math></span>
holdout of the full training pool (before client partitioning); each client additionally holds
out <!-- l. 68 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>20</mn><mi>%</mi></mrow></math></span>
of its own partition as a local test set. Metrics are evaluated every
<!-- l. 70 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mn>20</mn></mrow></math></span>
rounds.
</p>
   <div class='table'>
<!-- l. 72 --><p class='indent'>   </p><figure class='float' id='x1-16001r3'><span id='neural-network-architectures-used-for-each-dataset'></span>
<figcaption class='caption'><span class='id'>TABLE III: </span><span class='content'>Neural network architectures used for each dataset.            </span></figcaption><!-- tex4ht:label?: x1-16001r3  -->
 <table class='tabular' id='TBL-5'><colgroup id='TBL-5-1g'><col id='TBL-5-1' /><col id='TBL-5-2' /><col id='TBL-5-3' /><col id='TBL-5-4' /></colgroup><tr class='hline'><td></td><td></td><td></td><td></td></tr><tr id='TBL-5-1-' style='vertical-align:baseline;'><td class='td11' id='TBL-5-1-1' style='text-align:left; white-space:nowrap;'> Dataset     </td><td class='td11' id='TBL-5-1-2' style='text-align:left; white-space:nowrap;'> Architecture    </td><td class='td11' id='TBL-5-1-3' style='text-align:left;'> <!-- l. 95 --><p class='noindent'>Main
  layers </p> </td><td class='td11' id='TBL-5-1-4' style='text-align:left; white-space:nowrap;'> Parameters                                                                                             </td>
</tr><tr class='hline'><td></td><td></td><td></td><td></td></tr><tr id='TBL-5-2-' style='vertical-align:baseline;'><td class='td11' id='TBL-5-2-1' style='text-align:left; white-space:nowrap;'> MNIST      </td><td class='td11' id='TBL-5-2-2' style='text-align:left; white-space:nowrap;'> 2-conv / 2-FC  </td><td class='td11' id='TBL-5-2-3' style='text-align:left;'> <!-- l. 95 --><p class='noindent'>20/50
  conv
  filters,
  5x5
  kernels;
  dense
  layers
  500/10 </p> </td><td class='td11' id='TBL-5-2-4' style='text-align:left; white-space:nowrap;'><!-- l. 95 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow> <mo class='MathClass-rel' stretchy='false'>≈</mo> <mn>431</mn></mrow></math></span>K  </td>
</tr><tr class='hline'><td></td><td></td><td></td><td></td></tr><tr id='TBL-5-3-' style='vertical-align:baseline;'><td class='td11' id='TBL-5-3-1' style='text-align:left; white-space:nowrap;'> FEMNIST  </td><td class='td11' id='TBL-5-3-2' style='text-align:left; white-space:nowrap;'> 2-conv / 2-FC  </td><td class='td11' id='TBL-5-3-3' style='text-align:left;'> <!-- l. 95 --><p class='noindent'>64/128
  conv
  filters,
  5x5
  kernels;
  dense
  layers
  1024/62 </p> </td><td class='td11' id='TBL-5-3-4' style='text-align:left; white-space:nowrap;'> <!-- l. 95 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-rel' stretchy='false'>≈</mo> <mn>2.37</mn></mrow></math></span>M  </td>
</tr><tr class='hline'><td></td><td></td><td></td><td></td></tr><tr id='TBL-5-4-' style='vertical-align:baseline;'><td class='td11' id='TBL-5-4-1' style='text-align:left; white-space:nowrap;'> CIFAR-10  </td><td class='td11' id='TBL-5-4-2' style='text-align:left; white-space:nowrap;'> 3-conv / 3-FC  </td><td class='td11' id='TBL-5-4-3' style='text-align:left;'> <!-- l. 95 --><p class='noindent'>20/100/200
  conv
  filters,
  5x5
  kernels;
  dense
  layers
  512/256/10 </p> </td><td class='td11' id='TBL-5-4-4' style='text-align:left; white-space:nowrap;'> <!-- l. 95 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow> <mo class='MathClass-rel' stretchy='false'>≈</mo> <mn>2.32</mn></mrow></math></span>M  </td>
</tr><tr class='hline'><td></td><td></td><td></td><td></td></tr></table>
   </figure>
   </div>
   <h3 class='sectionHead' id='partitioning'><span class='titlemark'>APPENDIX B </span> <a id='x1-17000B'></a>Partitioning</h3>
   <h4 class='subsectionHead' id='data-heterogeneity-partition-scheme'><span class='titlemark'>B.1   </span> <a id='x1-18000B.1'></a>Data heterogeneity: partition scheme</h4>
<!-- l. 104 --><p class='noindent'>Let <!-- l. 104 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>C</mi></math></span> be the number
of classes and <!-- l. 104 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>G</mi></math></span> the
number of groups (<!-- l. 104 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>G</mi> <mo class='MathClass-rel' stretchy='false'>≤</mo> <mi>m</mi></mrow></math></span>,
must divide <!-- l. 104 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>m</mi></math></span>).
For each class <!-- l. 105 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>c</mi> <mo class='MathClass-rel' stretchy='false'>∈</mo><mo class='MathClass-open' stretchy='false'>{</mo><mn>1</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mo>…</mo><mo class='MathClass-punc' stretchy='false'>,</mo><mi>C</mi><mo class='MathClass-close' stretchy='false'>}</mo></mrow></math></span>
draw independently </p><table class='equation'><tr><td>
<!-- l. 106 --><p class='indent'>
</p><!-- l. 106 --><math class='equation' display='block' xmlns='http://www.w3.org/1998/Math/MathML'><mrow>
                    <mstyle class='label' id='x1-18001r1'></mstyle><!-- endlabel --><msub><mrow><mstyle mathvariant='bold'><mi>𝐩</mi></mstyle></mrow><mrow><mi>c</mi></mrow></msub><mspace class='thickpace' width='0.28em'></mspace> <mo class='MathClass-rel' stretchy='false'>∼</mo><mspace class='thickpace' width='0.28em'></mspace><mstyle mathvariant='normal'><mi>Dir</mi></mstyle><mo class='MathClass-open' stretchy='false'>(</mo><munder class='msub'><mrow><munder accentunder='false'><mrow><mi>α</mi><mo class='MathClass-punc' stretchy='false'>,</mo><mi class='MathClass-op'>…</mi><mo> ⁡<!-- FUNCTION APPLICATION --></mo><mo class='MathClass-punc' stretchy='false'>,</mo><mi>α</mi></mrow><mo>⏟</mo></munder></mrow><mrow><mi>G</mi></mrow></munder><mo class='MathClass-close' stretchy='false'>)</mo><mo class='MathClass-punc' stretchy='false'>,</mo><mspace class='quad' width='1em'></mspace><msub><mrow><mstyle mathvariant='bold'><mi>𝐩</mi></mstyle></mrow><mrow><mi>c</mi></mrow></msub> <mo class='MathClass-rel' stretchy='false'>∈</mo><msup><mrow><mi mathvariant='normal'>Δ</mi></mrow><mrow><mi>G</mi><mo class='MathClass-bin' stretchy='false'>−</mo><mn>1</mn></mrow></msup><mo class='MathClass-punc' stretchy='false'>,</mo>
</mrow></math></td><td class='eq-no'>(1)</td></tr></table>
<!-- l. 110 --><p class='noindent'>and assemble the <!-- l. 111 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>G</mi> <mo class='MathClass-bin' stretchy='false'>×</mo> <mi>C</mi></mrow></math></span>
heterogeneity matrix <!-- l. 111 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>M</mi></math></span>
with <!-- l. 111 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msub><mrow><mi>M</mi></mrow><mrow><mi mathvariant='italic'>𝑔𝑐</mi></mrow></msub> <mo class='MathClass-rel' stretchy='false'>=</mo> <msub><mrow><mi>p</mi></mrow><mrow><mi>c</mi></mrow></msub><mo class='MathClass-open' stretchy='false'>[</mo><mi>g</mi><mo class='MathClass-close' stretchy='false'>]</mo></mrow></math></span>, so each column
sums to one. Smaller <!-- l. 112 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>α</mi></math></span>
concentrates mass on fewer groups per class (high heterogeneity);
<!-- l. 113 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>α</mi> <mo class='MathClass-rel' stretchy='false'>→</mo><mi>∞</mi></mrow></math></span>
recovers uniform i.i.d. allocation.
</p>
   <h4 class='subsectionHead' id='pathological-partition'><span class='titlemark'>B.2   </span> <a id='x1-19000B.2'></a>Pathological partition.</h4>
<!-- l. 116 --><p class='noindent'>As an alternative to Eq. (<a href='#x1-18001r1'>1<!-- tex4ht:ref: eq:dirichlet  --></a>), a sparse binary mask assigns exactly
<!-- l. 117 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>L</mi></math></span> consecutive label indices
to each group, with <!-- l. 117 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>s</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mi>L</mi> <mo class='MathClass-bin' stretchy='false'>−</mo><mstyle class='text'><mtext>overlap</mtext></mstyle></mrow></math></span>:
</p><table class='equation'><tr><td>
<!-- l. 118 --><p class='indent'>
</p><!-- l. 118 --><math class='equation' display='block' xmlns='http://www.w3.org/1998/Math/MathML'><mrow>
            <mstyle class='label' id='x1-19001r2'></mstyle><!-- endlabel --><msub><mrow><mi>M</mi></mrow><mrow><mi mathvariant='italic'>𝑔𝑐</mi></mrow></msub> <mo class='MathClass-rel' stretchy='false'>=</mo> <mstyle mathvariant='bold'><mn>1</mn></mstyle><mspace class='negthinspace' width='-0.17em'></mspace> <mrow><mo fence='true' form='prefix'>[</mo><mrow><mi>c</mi> <mo class='MathClass-rel' stretchy='false'>∈</mo><mrow><mo class='MathClass-open' fence='true' mathsize='1.19em'>{</mo><mrow><mo class='MathClass-open' stretchy='false'>(</mo><mi>g</mi> <mo class='MathClass-bin' stretchy='false'>⋅</mo> <mi>s</mi> <mo class='MathClass-bin' stretchy='false'>+</mo> <mi>j</mi><mo class='MathClass-close' stretchy='false'>)</mo><mspace width='0.2em'></mspace><mo class='MathClass-bin' stretchy='false'> mod</mo><mspace width='0.2em'></mspace> <mi>C</mi><mspace class='thickpace' width='0.28em'></mspace> <mo class='MathClass-punc' stretchy='false'>:</mo> <mspace class='thickpace' width='0.28em'></mspace><mi>j</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>0</mn><mo class='MathClass-punc' stretchy='false'>,</mo><mo>…</mo><mo class='MathClass-punc' stretchy='false'>,</mo><mi>L</mi> <mo class='MathClass-bin' stretchy='false'>−</mo> <mn>1</mn></mrow><mo class='MathClass-close' fence='true' mathsize='1.19em'>}</mo></mrow></mrow><mo fence='true' form='postfix'>]</mo></mrow>
</mrow></math></td><td class='eq-no'>(2)</td></tr></table>
<!-- l. 121 --><p class='noindent'>after column-normalizing so each label is fully consumed. This yields hard,
near-disjoint clusters that share exactly <span class='cmti-10'>overlap </span>labels between adjacent
groups.
</p>
   <h4 class='subsectionHead' id='hierarchical-assignment'><span class='titlemark'>B.3   </span> <a id='x1-20000B.3'></a>Hierarchical assignment.</h4>
<!-- l. 126 --><p class='noindent'>Algorithm <a href='#hierarchical-data-partition-used-by-both-methods'>1<!-- tex4ht:ref: alg:partition  --></a> shows how <!-- l. 126 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>M</mi></math></span>
is turned into per-worker index sets. Workers within the same group receive
an i.i.d. subsample of their group’s pool, so the two-level structure lets
<!-- l. 128 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>G</mi> <mo class='MathClass-rel' stretchy='false'>&lt;</mo> <mi>m</mi></mrow></math></span>
impose cluster structure while keeping within-cluster variance low.
</p>
   <div class='algorithm'>
<!-- l. 131 --><p class='indent'>   </p><figure class='float' id='x1-20001r1'><span id='hierarchical-data-partition-used-by-both-methods'></span>
<figcaption class='caption'><span class='id'>Algorithm 1 </span><span class='content'>Hierarchical data partition (used by both methods)
</span></figcaption><!-- tex4ht:label?: x1-20001r1  -->
<div class='algorithmic'>
       <span class='label-11.99998pt'>
<span class='cmbx-10'>Require:</span> </span> <span class='algorithmic'> targets <!-- l. 135 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mstyle mathvariant='bold'><mi>𝐲</mi></mstyle></math></span>,    matrix <!-- l. 135 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>M</mi> <mo class='MathClass-rel' stretchy='false'>∈</mo> <msup><mrow><mi>ℝ</mi></mrow><mrow><mi>G</mi><mo class='MathClass-bin' stretchy='false'>×</mo><mi>C</mi></mrow></msup></mrow></math></span>,    workers per group <!-- l. 136 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>w</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mi>m</mi><mo class='MathClass-bin' stretchy='false'>∕</mo><mi>G</mi></mrow></math></span>        </span><br class='algorithmic' /><span class='label-11.99998pt'>  <span class='cmr-8'>1:</span> </span> <span class='algorithmic'> <span class='cmbx-10'>for</span> each class <!-- l. 137 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>c</mi></math></span> <span class='cmbx-10'>do</span>        </span><br class='algorithmic' /><span class='label-11.99998pt'>  <span class='cmr-8'>2:</span> </span> <span class='algorithmic'>     <!-- l. 138 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msub><mrow><mi>I</mi></mrow><mrow><mi>c</mi></mrow></msub> <mo class='MathClass-rel' stretchy='false'>←</mo></mrow></math></span>    shuffled indices <!-- l. 138 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>{</mo><mi>i</mi> <mo class='MathClass-punc' stretchy='false'>:</mo> <msub><mrow><mi>y</mi></mrow><mrow><mi>i</mi></mrow></msub> <mo class='MathClass-rel' stretchy='false'>=</mo> <mi>c</mi><mo class='MathClass-close' stretchy='false'>}</mo></mrow></math></span>        </span><br class='algorithmic' /><span class='label-11.99998pt'>  <span class='cmr-8'>3:</span> </span> <span class='algorithmic'>     <span class='cmbx-10'>for</span> each group <!-- l. 139 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>g</mi></math></span> <span class='cmbx-10'>do</span>        </span><br class='algorithmic' /><span class='label-11.99998pt'>  <span class='cmr-8'>4:</span> </span> <span class='algorithmic'>          <!-- l. 140 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><msub><mrow><mstyle class='text'><mtext>count</mtext></mstyle></mrow><mrow><mi mathvariant='italic'>𝑔𝑐</mi></mrow></msub> <mo class='MathClass-rel' stretchy='false'>←</mo><mo class='MathClass-open' stretchy='false'>⌊</mo><msub><mrow><mi>M</mi></mrow><mrow><mi mathvariant='italic'>𝑔𝑐</mi></mrow></msub> <mo class='MathClass-bin' stretchy='false'>⋅</mo><mo class='MathClass-rel' stretchy='false'>|</mo><msub><mrow><mi>I</mi></mrow><mrow><mi>c</mi></mrow></msub><mo class='MathClass-rel' stretchy='false'>|</mo><mo class='MathClass-close' stretchy='false'>⌋</mo></mrow></math></span>        </span><br class='algorithmic' /><span class='label-11.99998pt'>  <span class='cmr-8'>5:</span> </span> <span class='algorithmic'>     <span class='cmbx-10'>end</span> <span class='cmbx-10'>for</span>        </span><br class='algorithmic' /><span class='label-11.99998pt'>  <span class='cmr-8'>6:</span> </span> <span class='algorithmic'>     distribute <!-- l. 142 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mi>I</mi></mrow><mrow><mi>c</mi></mrow></msub></math></span>    into group pools <!-- l. 142 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mstyle mathvariant='script'><mi>𝒫</mi></mstyle></mrow><mrow><mi>g</mi></mrow></msub></math></span>    according to <!-- l. 142 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mstyle class='text'><mtext>count</mtext></mstyle></mrow><mrow><mi mathvariant='italic'>𝑔𝑐</mi></mrow></msub></math></span>        </span><br class='algorithmic' /><span class='label-11.99998pt'>  <span class='cmr-8'>7:</span> </span> <span class='algorithmic'> <span class='cmbx-10'>end</span> <span class='cmbx-10'>for</span>        </span><br class='algorithmic' /><span class='label-11.99998pt'>  <span class='cmr-8'>8:</span> </span> <span class='algorithmic'> <span class='cmbx-10'>for</span> each group <!-- l. 144 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>g</mi></math></span> <span class='cmbx-10'>do</span>        </span><br class='algorithmic' /><span class='label-11.99998pt'>  <span class='cmr-8'>9:</span> </span> <span class='algorithmic'>     shuffle <!-- l. 145 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><msub><mrow><mstyle mathvariant='script'><mi>𝒫</mi></mstyle></mrow><mrow><mi>g</mi></mrow></msub></math></span>;    split into <!-- l. 145 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mi>w</mi></math></span>    equal chunks <!-- l. 145 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow> <mo class='MathClass-rel' stretchy='false'>→</mo></mrow></math></span>    workers <!-- l. 146 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mo class='MathClass-open' stretchy='false'>{</mo><mi>i</mi> <mo class='MathClass-punc' stretchy='false'>:</mo> <mo class='MathClass-open' stretchy='false'>⌊</mo><mi>i</mi><mo class='MathClass-bin' stretchy='false'>∕</mo><mi>w</mi><mo class='MathClass-close' stretchy='false'>⌋</mo> <mo class='MathClass-rel' stretchy='false'>=</mo> <mi>g</mi><mo class='MathClass-close' stretchy='false'>}</mo></mrow></math></span>        </span><br class='algorithmic' /><span class='label-11.99998pt'> <span class='cmr-8'>10:</span> </span> <span class='algorithmic'> <span class='cmbx-10'>end</span> <span class='cmbx-10'>for</span></span>
</div>
   </figure>
   </div>
   <h3 class='sectionHead' id='further-results-on-femnist'><span class='titlemark'>APPENDIX C </span> <a id='x1-21000C'></a>Further results on FEMNIST</h3>
   <h4 class='subsectionHead' id='rewards-and-samplers'><span class='titlemark'>C.1   </span> <a id='x1-22000C.1'></a>Rewards and samplers</h4>
<!-- l. 163 --><p class='noindent'>In Figure <a href='#first-row-of-heatmaps-local-accuracy-second-row-global-accuracy-for-the-heatmap-rows-represent-rewards-while-columns-are-samplers-detailed-observations-are-presented-in-sectionref-secresults-uniform-is-reported-for-completeness-under-imd-but-its-rewardindependent'>3<!-- tex4ht:ref: fig:sampler-reward-accuracies  --></a> we present the fully detailed heatmap for global and local accuracy on
our pathological-clusters sweep on FEMNIST. Figure  <a href='#effect-of-changing-the-reward-from-imd-to-cos-positive-accuracy-values-favor-cos-negative-loss-values-are-better-cos-improves-local-performance-when-heterogeneity-is-strong-but-sacrifices-global-performance'>4<!-- tex4ht:ref: fig:reward-gap-histograms  --></a> shows the performance of
the COS vs IMD rewards, averaged over samplers both on dirichlet-clusters and
pathological-clusters. We can see that a higher heterogeneity favours COS
rewards for personalization, whereas at lower heterogeneity the difference is not
significant.
</p>
   <figure class='figure'>
<!-- l. 167 --><p class='noindent' id='first-row-of-heatmaps-local-accuracy-second-row-global-accuracy-for-the-heatmap-rows-represent-rewards-while-columns-are-samplers-detailed-observations-are-presented-in-sectionref-secresults-uniform-is-reported-for-completeness-under-imd-but-its-rewardindependent'><img alt='PIC' src='report/figures/femnist-pathological-clusters/femnist_reward_accuracy_heatmaps.png' /> <a id='x1-22001r3'></a>
</p>
<figcaption class='caption'><span class='id'>Fig. 3: </span><span class='content'>First row of heatmaps: local accuracy; second row: Global accuracy.
For the heatmap, rows represent rewards, while columns are samplers. Detailed
observations are presented in Section <a href='#results-and-discussion'>IV<!-- tex4ht:ref: sec:results  --></a>. Uniform is reported for completeness
under IMD, but it’s reward-independent.                                </span></figcaption><!-- tex4ht:label?: x1-22001r3  -->
   </figure>
   <figure class='figure' id='x1-22004r4'><span id='effect-of-changing-the-reward-from-imd-to-cos-positive-accuracy-values-favor-cos-negative-loss-values-are-better-cos-improves-local-performance-when-heterogeneity-is-strong-but-sacrifices-global-performance'></span>
<div class='subfigure'>
<!-- l. 174 --><p class='noindent'></p><!-- l. 176 --><p class='noindent'><img alt='PIC' src='report/figures/femnist-pathological-clusters/femnist_pathological_reward_delta.png' /> <a id='x1-22002r1'></a>
</p>
<div class='caption'><span class='id'><span class='cmr-9'>(a) </span></span><span class='content'><span class='cmr-9'>Pathological clusters.</span>            </span></div></div>                                  <div class='subfigure'>
<!-- l. 180 --><p class='noindent'></p><!-- l. 182 --><p class='noindent'><img alt='PIC' src='report/figures/femnist-alpha-clusters/femnist_alpha_reward_delta.png' /> <a id='x1-22003r2'></a>
</p>
<div class='caption'><span class='id'><span class='cmr-9'>(b) </span></span><span class='content'><span class='cmr-9'>Dirichlet clusters.</span>               </span></div></div>
<div class='caption'><span class='id'>Fig. 4: </span><span class='content'>Effect of changing the reward from IMD to COS. Positive accuracy values
favor COS; negative loss values are better. COS improves local performance
when heterogeneity is strong, but sacrifices global performance.
</span></div>
   </figure>
   <figure class='figure' id='x1-22007r5'><span id='femnist-imd-reward-we-expect-neighbour-disagreement-to-be-higher-for-samplers-which-are-more-similar-to-uniform-and-we-found-this-result-here-eg-see-that-cts-has-lower-neighbour-disagreement-than-cucb-similarly-for-regret'></span>
<div class='subfigure'>
<!-- l. 193 --><p class='noindent'></p><!-- l. 195 --><p class='noindent'><img alt='PIC' src='report/figures/femnist-pathological-clusters/misc/femnist_imd_neighbor_disagreement.png' /> <a id='x1-22005r1'></a>
</p>
<div class='caption'><span class='id'><span class='cmr-9'>(a) </span></span><span class='content'><span class='cmr-9'>Neighbour disagreement, IMD
reward, FEMNIST.</span>           </span></div></div>                                       <div class='subfigure'>
<!-- l. 199 --><p class='noindent'></p><!-- l. 201 --><p class='noindent'><img alt='PIC' src='report/figures/femnist-pathological-clusters/misc/femnist_imd_normalized_regret.png' /> <a id='x1-22006r2'></a>
</p>
<div class='caption'><span class='id'><span class='cmr-9'>(b)     </span></span><span class='content'><span class='cmr-9'>Regret,     IMD     reward,
FEMNIST.</span>                  </span></div></div>
<div class='caption'><span class='id'>Fig. 5: </span><span class='content'>FEMNIST, IMD reward. We expect neighbour disagreement to be higher
for samplers which are more similar to uniform, and we found this result here,
e.g. see that CTS has lower neighbour disagreement than CUCB. Similarly for
regret.
</span></div>
   </figure>
   <figure class='figure' id='x1-22010r6'><span id='exp-sampling-on-the-pathologicalcluster-c-femnist-run-with-imd-vs-cos-reward-we-can-see-that-cos-drives-the-algorithm-to-be-more-aggressive-towards-sampling-incluster-neighbors'></span>
<div class='subfigure'>
<!-- l. 212 --><p class='noindent'></p><!-- l. 214 --><p class='noindent'><img alt='PIC' src='report/figures/femnist-pathological-clusters/probabilities/exp3-C5-Cosine.png' /> <a id='x1-22008r1'></a>
</p>
<div class='caption'><span class='id'><span class='cmr-9'>(a) </span></span><span class='content'><span class='cmr-9'>EXP3 + COS</span>                  </span></div></div>                                  <div class='subfigure'>
<!-- l. 218 --><p class='noindent'></p><!-- l. 220 --><p class='noindent'><img alt='PIC' src='report/figures/femnist-pathological-clusters/single-runs/5c/exp3/clustering_sampler_probability.png' /> <a id='x1-22009r2'></a>
</p>
<div class='caption'><span class='id'><span class='cmr-9'>(b) </span></span><span class='content'><span class='cmr-9'>EXP3 + IMD</span>                  </span></div></div>
<div class='caption'><span class='id'>Fig. 6: </span><span class='content'>EXP3 sampling on the pathological-cluster (c=5) FEMNIST run with
IMD vs COS reward. We can see that COS drives the algorithm to be more
aggressive towards sampling in-cluster neighbors.
</span></div>
   </figure>
   <h4 class='subsectionHead' id='detailed-results-on-training-process'><span class='titlemark'>C.2   </span> <a id='x1-23000C.2'></a>Detailed results on training process</h4>
<!-- l. 228 --><p class='noindent'>We now present detailed results on the training process, focusing on how the studied
metrics evolve across rounds.
</p><!-- l. 230 --><p class='indent'>   As expected, the bandit algorithms that achieve the highest local accuracy are
also those that better prevent drift among nodes. This results in smaller differences
across the considered metrics, including regret, local accuracy, and neighbor
disagreement.
</p>
   <figure class='figure' id='x1-23011r7'><span id='comparison-between-cts-and-exp-metrics-on-femnist-pathological-clusters'></span>
<div class='subfigure'>
<!-- l. 236 --><p class='noindent'></p><!-- l. 238 --><p class='noindent'><img alt='PIC' src='report/figures/femnist-pathological-clusters/single-runs-selected/femnist_cts_imd_gradient_norm.png' /> <a id='x1-23001r1'></a>
</p>
<div class='caption'><span class='id'><span class='cmr-9'>(a) </span></span><span class='content'><span class='cmr-9'>CTS: Gradient norm</span>       </span></div></div>                                       <div class='subfigure'>
<!-- l. 242 --><p class='noindent'></p><!-- l. 244 --><p class='noindent'><img alt='PIC' src='report/figures/femnist-pathological-clusters/single-runs-selected/femnist_exp3_imd_gradient_norm.png' /> <a id='x1-23002r2'></a>
</p>
<div class='caption'><span class='id'><span class='cmr-9'>(b) </span></span><span class='content'><span class='cmr-9'>EXP3: Gradient norm</span>      </span></div></div>
<div class='subfigure'>
<!-- l. 250 --><p class='noindent'></p><!-- l. 252 --><p class='noindent'><img alt='PIC' src='report/figures/femnist-pathological-clusters/single-runs-selected/femnist_cts_imd_neighbor_disagreement.png' /> <a id='x1-23003r3'></a>
</p>
<div class='caption'><span class='id'><span class='cmr-9'>(c) </span></span><span class='content'><span class='cmr-9'>CTS: Neighbor disagreement</span> </span></div></div>                                       <div class='subfigure'>
<!-- l. 256 --><p class='noindent'></p><!-- l. 258 --><p class='noindent'><img alt='PIC' src='report/figures/femnist-pathological-clusters/single-runs-selected/femnist_exp3_imd_neighbor_disagreement.png' /> <a id='x1-23004r4'></a>
</p>
<div class='caption'><span class='id'><span class='cmr-9'>(d) </span></span><span class='content'><span class='cmr-9'>EXP3: Neighbor disagreement</span></span></div></div>
<div class='subfigure'>
<!-- l. 264 --><p class='noindent'></p><!-- l. 266 --><p class='noindent'><img alt='PIC' src='report/figures/femnist-pathological-clusters/single-runs-selected/femnist_cts_imd_regret.png' /> <a id='x1-23005r5'></a>
</p>
<div class='caption'><span class='id'><span class='cmr-9'>(e) </span></span><span class='content'><span class='cmr-9'>CTS: Regret</span>              </span></div></div>                                       <div class='subfigure'>
<!-- l. 270 --><p class='noindent'></p><!-- l. 272 --><p class='noindent'><img alt='PIC' src='report/figures/femnist-pathological-clusters/single-runs-selected/femnist_exp3_imd_regret.png' /> <a id='x1-23006r6'></a>
</p>
<div class='caption'><span class='id'><span class='cmr-9'>(f) </span></span><span class='content'><span class='cmr-9'>EXP3: Regret</span>             </span></div></div>
<div class='subfigure'>
<!-- l. 278 --><p class='noindent'></p><!-- l. 280 --><p class='noindent'><img alt='PIC' src='report/figures/femnist-pathological-clusters/single-runs-selected/femnist_cts_imd_train_loss.png' /> <a id='x1-23007r7'></a>
</p>
<div class='caption'><span class='id'><span class='cmr-9'>(g) </span></span><span class='content'><span class='cmr-9'>CTS: Train loss</span>           </span></div></div>                                       <div class='subfigure'>
<!-- l. 284 --><p class='noindent'></p><!-- l. 286 --><p class='noindent'><img alt='PIC' src='report/figures/femnist-pathological-clusters/single-runs-selected/femnist_exp3_imd_train_loss.png' /> <a id='x1-23008r8'></a>
</p>
<div class='caption'><span class='id'><span class='cmr-9'>(h) </span></span><span class='content'><span class='cmr-9'>EXP3: Train loss</span>          </span></div></div>
<div class='subfigure'>
<!-- l. 292 --><p class='noindent'></p><!-- l. 294 --><p class='noindent'><img alt='PIC' src='report/figures/femnist-pathological-clusters/single-runs-selected/femnist_cts_imd_validation_accuracy.png' /> <a id='x1-23009r9'></a>
</p>
<div class='caption'><span class='id'><span class='cmr-9'>(i) </span></span><span class='content'><span class='cmr-9'>CTS: Validation accuracy</span>    </span></div></div>                                       <div class='subfigure'>
<!-- l. 298 --><p class='noindent'></p><!-- l. 300 --><p class='noindent'><img alt='PIC' src='report/figures/femnist-pathological-clusters/single-runs-selected/femnist_exp3_imd_validation_accuracy.png' /> <a id='x1-23010r10'></a>
</p>
<div class='caption'><span class='id'><span class='cmr-9'>(j) </span></span><span class='content'><span class='cmr-9'>EXP3: Validation accuracy</span>   </span></div></div>
<div class='caption'><span class='id'>Fig. 7: </span><span class='content'>Comparison between CTS and EXP3 metrics on FEMNIST pathological
clusters.
</span></div>
   </figure>
   <h3 class='sectionHead' id='further-results-on-cifar'><span class='titlemark'>APPENDIX D </span> <a id='x1-24000D'></a>Further results on Cifar</h3>
   <h4 class='subsectionHead' id='cifar-experiments-sweeping-on-bandit-algorithms-and-discounts'><span class='titlemark'>D.1   </span> <a id='x1-25000D.1'></a>Cifar experiments: sweeping on bandit algorithms and discounts</h4>
<!-- l. 313 --><p class='noindent'>We provide additional experiments on the Cifar dataset, whose goal is to further test
our Bandit algorithms and check the performance of discounting.
</p><!-- l. 315 --><p class='indent'>   <span class='cmbx-10'>CUCB with cosine similarity</span>. First, we consider the CUCB bandit with COS
reward. The results show that the gradient norm increases over time, while the global
test accuracy remains very low and nearly constant. The neighbour disagreement is
highly noisy, and the regret does not converge. The time-normalized reward
decreases, suggesting that the model weights are drifting apart rather than reaching
consensus. The discounted and non-discounted variants behave almost identically,
with the exception of neighbour disagreement, which is substantially worse in the
discounted case. For this reason, we do not report the discounted results, since
they are largely redundant; an explanation for this behaviour is provided
below.
</p>
   <figure class='figure' id='x1-25007r8'><span id='performance-metrics-against-rounds-for-cucb-cosine-similarity-reward-on-first-row-and-model-distance-on-second-row-cifar-these-results-suggest-cosine-similarity-performs-worse-than-model-distance-as-a-reward'></span>
<div class='subfigure'>
<!-- l. 320 --><p class='noindent'></p><!-- l. 322 --><p class='noindent'><img alt='PIC' src='report/figures/cifar_mattea_260610/cucb_cosine/validation_accuracy.png' /> <a id='x1-25001r1'></a>
</p>
<div class='caption'><span class='id'><span class='cmr-9'>(a)  </span></span><span class='content'><span class='cmr-9'>Validation  accuracy,
COS reward.</span>          </span></div></div>                                              <div class='subfigure'>
<!-- l. 326 --><p class='noindent'></p><!-- l. 328 --><p class='noindent'><img alt='PIC' src='report/figures/cifar_mattea_260610/cucb_cosine/train_loss.png' /> <a id='x1-25002r2'></a>
</p>
<div class='caption'><span class='id'><span class='cmr-9'>(b)    </span></span><span class='content'><span class='cmr-9'>Train    loss,    COS
reward.</span>              </span></div></div>                                              <div class='subfigure'>
<!-- l. 332 --><p class='noindent'></p><!-- l. 334 --><p class='noindent'><img alt='PIC' src='report/figures/cifar_mattea_260610/cucb_cosine/regret.png' /> <a id='x1-25003r3'></a>
</p>
<div class='caption'><span class='id'><span class='cmr-9'>(c) </span></span><span class='content'><span class='cmr-9'>Regret, COS reward.</span> </span></div></div> <div class='subfigure'>
<!-- l. 338 --><p class='noindent'></p><!-- l. 340 --><p class='noindent'><img alt='PIC' src='report/figures/cifar_mattea_260610/cucb_model/cucb_pdist_nodisc_validation_accuracy.png' /> <a id='x1-25004r4'></a>
</p>
<div class='caption'><span class='id'><span class='cmr-9'>(d)  </span></span><span class='content'><span class='cmr-9'>Validation  accuracy,
IMD reward.</span>          </span></div></div> <div class='subfigure'>
<!-- l. 343 --><p class='noindent'></p><!-- l. 345 --><p class='noindent'><img alt='PIC' src='report/figures/cifar_mattea_260610/cucb_model/cucb_pdist_nodisc_train_loss.png' /> <a id='x1-25005r5'></a>
</p>
<div class='caption'><span class='id'><span class='cmr-9'>(e)    </span></span><span class='content'><span class='cmr-9'>Train    loss,    IMD
reward.</span>              </span></div></div>                                              <div class='subfigure'>
<!-- l. 349 --><p class='noindent'></p><!-- l. 351 --><p class='noindent'><img alt='PIC' src='report/figures/cifar_mattea_260610/cucb_model/cucb_pdist_regret_nodisc.png' /> <a id='x1-25006r6'></a>
</p>
<div class='caption'><span class='id'><span class='cmr-9'>(f) </span></span><span class='content'><span class='cmr-9'>Regret, IMD reward.</span> </span></div></div>
<div class='caption'><span class='id'>Fig. 8: </span><span class='content'>Performance metrics against rounds for CUCB, cosine similarity reward
on first row and model distance on second row, CIFAR. These results suggest
cosine similarity performs worse than model distance as a reward.
</span></div>
   </figure>
<!-- l. 359 --><p class='indent'>   <span class='cmbx-10'>CTS and COS </span>the gradient norm initially increases. However, unlike in the
CUCB case, the training loss decreases and the local accuracy improves, providing
the first signs of convergence. The clustering structure also appears to be detected,
although the global test accuracy remains poor. At the same time, both regret and
neighbour disagreement continue to increase, indicating that the system is still far
from full convergence.
</p><!-- l. 361 --><p class='indent'>   <span class='cmbx-10'>CUCB and CTS with IMD. </span>The detected clusters are much clearer than with
the cosine similarity reward. The normalized regret decreases for the first time, see
Figure <a href='#performance-metrics-against-rounds-for-cucb-cosine-similarity-reward-on-first-row-and-model-distance-on-second-row-cifar-these-results-suggest-cosine-similarity-performs-worse-than-model-distance-as-a-reward'>8<!-- tex4ht:ref: fig:cucb-cosine-cifar  --></a> (f), and the gradient norm eventually starts to decrease as well. These
results suggest that cosine similarity performs worse than model distance as a
reward, as this holds also for CTS (but we will not focus on it). Note that, as it
chooses to sample the top K nodes according to its internal weights, and we chose a
sample probability of 20%, which is 6 nodes in our setting, the best result would
be to sample each node in its own cluster plus another node. This indeed
happens.
</p><!-- l. 363 --><p class='indent'>   Note that, although CTS samples much more from its neighbours, its global
validation accuracy is equal to the one of CUCB Figure <a href='#comparison-cucb-vs-cts-with-imdbased-rewards-final-round'>10<!-- tex4ht:ref: fig:cts-cucb-comparison  --></a>, confirming it achieves
the best personalization vs generalization results. This is coherent also with the fact
that in Figure <a href='#comparison-cucb-vs-cts-with-imdbased-rewards-final-round'>10<!-- tex4ht:ref: fig:cts-cucb-comparison  --></a> the inverse of model distance of CTS between nodes not in the
same cluster is not much higher than CUCB.
</p><!-- l. 366 --><p class='indent'>   <span class='cmbx-10'>Discount factor. </span>As observed before, increasing the discount factor makes the
resulting distribution increasingly similar to the uniform distribution. We
therefore report a comparison of the clustering behaviour as the discount is
reduced.
</p>
   <figure class='figure' id='x1-25012r9'><span id='comparison-of-cts-probabilities-for-different-discount-factors-final-round-imd-reward-the-result-of-discounting-is-that-the-final-distribution-is-closer-to-a-uniform-and-thus-less-accurately-identifies-the-clusters'></span>
<div class='subfigure'>
<!-- l. 371 --><p class='noindent'></p><!-- l. 373 --><p class='noindent'><img alt='PIC' src='report/figures/cifar_mattea_260610/cluster_discount_comparison/gamma09_cts_clustering_sampler_probability.png' /> <a id='x1-25008r1'></a>
</p>
<div class='caption'><span class='id'><span class='cmr-9'>(a)</span>
</span><span class='content'><!-- l. 374 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>γ</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>0.9</mn></mrow></math></span><span class='cmr-9'>.</span></span></div></div>                                                 <div class='subfigure'>
<!-- l. 377 --><p class='noindent'></p><!-- l. 379 --><p class='noindent'><img alt='PIC' src='report/figures/cifar_mattea_260610/cluster_discount_comparison/gamma095_cts_clustering_sampler_probability.png' /> <a id='x1-25009r2'></a>
</p>
<div class='caption'><span class='id'><span class='cmr-9'>(b)</span>
</span><span class='content'><!-- l. 380 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>γ</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>0.95</mn></mrow></math></span><span class='cmr-9'>.</span></span></div></div>                                                 <div class='subfigure'>
<!-- l. 383 --><p class='noindent'></p><!-- l. 385 --><p class='noindent'><img alt='PIC' src='report/figures/cifar_mattea_260610/cluster_discount_comparison/gamma099_cts_clustering_sampler_probability.png' /> <a id='x1-25010r3'></a>
</p>
<div class='caption'><span class='id'><span class='cmr-9'>(c)</span>
</span><span class='content'><!-- l. 386 --><span class="report-inline-math"><math display='inline' xmlns='http://www.w3.org/1998/Math/MathML'><mrow><mi>γ</mi> <mo class='MathClass-rel' stretchy='false'>=</mo> <mn>0.99</mn></mrow></math></span><span class='cmr-9'>.</span></span></div></div>                                                 <div class='subfigure'>
<!-- l. 389 --><p class='noindent'></p><!-- l. 391 --><p class='noindent'><img alt='PIC' src='report/figures/cifar_mattea_260610/cluster_discount_comparison/nodisc_cts_clustering_sampler_probability.png' /> <a id='x1-25011r4'></a>
</p>
<div class='caption'><span class='id'><span class='cmr-9'>(d) </span></span><span class='content'><span class='cmr-9'>No discount.</span>   </span></div></div>
<div class='caption'><span class='id'>Fig. 9:  </span><span class='content'>Comparison  of  CTS  probabilities  for  different  discount  factors,  final
round, <span class='cmbx-10'>IMD </span>reward. The result of discounting is that the final distribution is
closer to a uniform, and thus less accurately identifies the clusters.
</span></div>
   </figure>
<!-- l. 399 --><p class='indent'>   <span class='cmbx-10'>CUCB vs CTS. </span>Finally, we compare the clustering capabilities of CUCB and
CTS in Figure <a href='#comparison-cucb-vs-cts-with-imdbased-rewards-final-round'>10<!-- tex4ht:ref: fig:cts-cucb-comparison  --></a>. CUCB performs worse, while CTS shows a moderate
improvement. We compare them reward-wise, since CUCB is a deterministic
algorithm and thus interpreting its sampled neighbors as probabilities doesn’t make
much sense.
</p>
   <figure class='figure' id='x1-25017r10'><span id='comparison-cucb-vs-cts-with-imdbased-rewards-final-round'></span>
<div class='subfigure'>
<!-- l. 424 --><p class='noindent'></p><!-- l. 426 --><p class='noindent'><img alt='PIC' src='report/figures/cifar_mattea_260610/cluster_comparison_cucbvscts/cucb_model_clustering_neighbor_disagreement.png' /> <a id='x1-25013r1'></a>
</p>
<div class='caption'><span class='id'><span class='cmr-9'>(a)            </span></span><span class='content'><span class='cmr-9'>CUCB,
clustering
probabilities.</span>     </span></div></div>                                                   <div class='subfigure'>
<!-- l. 430 --><p class='noindent'></p><!-- l. 432 --><p class='noindent'><img alt='PIC' src='report/figures/cifar_mattea_260610/cluster_comparison_cucbvscts/cucb_global_accuracy.png' /> <a id='x1-25014r2'></a>
</p>
<div class='caption'><span class='id'><span class='cmr-9'>(b)  </span></span><span class='content'><span class='cmr-9'>CUCB,  global
test accuracy.</span>     </span></div></div>                                                   <div class='subfigure'>
<!-- l. 436 --><p class='noindent'></p><!-- l. 438 --><p class='noindent'><img alt='PIC' src='report/figures/cifar_mattea_260610/cluster_comparison_cucbvscts/cts_model_clustering_neighbor_disagreement.png' /> <a id='x1-25015r3'></a>
</p>
<div class='caption'><span class='id'><span class='cmr-9'>(c) </span></span><span class='content'><span class='cmr-9'>CTS, clustering
probabilities.</span>     </span></div></div>                                                   <div class='subfigure'>
<!-- l. 442 --><p class='noindent'></p><!-- l. 444 --><p class='noindent'><img alt='PIC' src='report/figures/cifar_mattea_260610/cluster_comparison_cucbvscts/cts_global_accuracy.png' /> <a id='x1-25016r4'></a>
</p>
<div class='caption'><span class='id'><span class='cmr-9'>(d) </span></span><span class='content'><span class='cmr-9'>CTS, global test
accuracy.</span>        </span></div></div>
<div class='caption'><span class='id'>Fig. 10: </span><span class='content'>Comparison CUCB vs CTS with <span class='cmbx-10'>IMD</span>-based rewards, final round.
</span></div>
   </figure>
</div>
