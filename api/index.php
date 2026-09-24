<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/content.php';
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$endpoint = $_GET['endpoint'] ?? $_GET['resource'] ?? 'updates';
$pdo = database();
try {
    if ($endpoint === 'internship') {
        $logs = $pdo ? $pdo->query('SELECT week, date_info AS date, title, content, gif FROM internship_logs ORDER BY sort_order')->fetchAll() : [];
        if (!$logs) $logs = internshipLogs();
        foreach ($logs as &$log) $log['content'] = is_string($log['content']) ? json_decode($log['content'], true) : $log['content'];
        echo json_encode(['success'=>true,'data'=>['title'=>'Stepping out of the classroom and into the industry.','intro'=>'As a College of Computing Studies student at Western Mindanao State University (WMSU), one of our major milestones is the 2nd-year internship. It’s the bridge between the academic theories we study and the real-world application of code.','logs'=>$logs]], JSON_UNESCAPED_SLASHES);
        exit;
    }
    if ($endpoint === 'updates') {
        $updates = $pdo ? $pdo->query('SELECT title, status, date_info, description_title, description, link, link_text FROM updates ORDER BY sort_order')->fetchAll() : [];
        echo json_encode(['success'=>true,'data'=>$updates ?: portfolioUpdates()], JSON_UNESCAPED_SLASHES);
        exit;
    }
    http_response_code(404);
    echo json_encode(['success'=>false,'error'=>'Unknown endpoint']);
} catch (Throwable $e) {
    if ($endpoint === 'updates') {
        echo json_encode(['success'=>true,'data'=>portfolioUpdates()], JSON_UNESCAPED_SLASHES);
    } elseif ($endpoint === 'internship') {
        echo json_encode(['success'=>true,'data'=>['title'=>'Stepping out of the classroom and into the industry.','intro'=>'As a College of Computing Studies student at Western Mindanao State University (WMSU), one of our major milestones is the 2nd-year internship. It’s the bridge between the academic theories we study and the real-world application of code.','logs'=>internshipLogs()]], JSON_UNESCAPED_SLASHES);
    } else {
        http_response_code(500);
        echo json_encode(['success'=>false,'error'=>'Unable to load data']);
    }
}
