<?php $title = 'Neithan Deniel B. Gula | Portfolio'; require __DIR__ . '/config/page.php'; ?>
<header class="hero">
  <div class="hero-copy"><nav>Neithan.Dev // 2026</nav><p class="eyebrow">Available for inquiries</p><h1>LOGIC<br>MEETS<br><em>MOTION.</em></h1><blockquote>"I build the engines that make the web run and the games play."</blockquote><p class="muted">Neithan Deniel B. Gula</p><div class="card"><strong>Education</strong><h3>Western Mindanao State University</h3><span>College of Computing Studies</span></div></div>
  <div class="hero-art"><img src="public/images/me.jpg" alt="Neithan profile"><a href="catloon.php"><img class="pixel" src="public/images/pixel-char.gif" alt="Play Catloon"></a></div>
</header>
<main class="container"><section><h2>Skill Stats</h2><div class="skills"><?php foreach ([['HTML / CSS',5],['JavaScript',6],['Backend Logic',8],['UI Designing',7],['Problem Solving',8]] as $skill): ?><div><label><?= htmlspecialchars($skill[0]) ?><span>LVL <?= $skill[1] ?></span></label><progress value="<?= $skill[1] ?>" max="10"></progress></div><?php endforeach; ?></div></section>
<section><h2>Selected Projects</h2><article class="project"><span class="year">2025</span><div><h3><a href="https://pokedexnitan.netlify.app/" target="_blank" rel="noopener">Pokedex</a></h3><p>Simple UI/UX 1st year web dev API usage of Pokemon using HTML/CSS/JS.</p><img src="public/images/pokedex.png" alt="Pokedex screenshot"></div></article></section>
<section id="contact"><h2>Explore</h2><p><a class="button" href="updates.php">Read updates</a> <a class="button" href="catloon.php">Play Catloon</a></p></section></main>
<?php require __DIR__ . '/config/footer.php'; ?>
