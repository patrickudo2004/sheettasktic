import type { Task } from './types';

function downloadFile(filename: string, content: string, mimeType: string) {
  const element = document.createElement('a');
  const file = new Blob([content], { type: mimeType });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
  document.body.removeChild(element);
}

export function exportAsCsv(tasks: Task[], fileName: string) {
  const headers = ['Title', 'Notes', 'Due Date', 'Priority', 'Status'];
  const rows = tasks.map(task => [
    `"${(task.title || '').replace(/"/g, '""')}"`,
    `"${(task.notes || '').replace(/"/g, '""')}"`,
    task.dueDate || '',
    task.priority || '',
    task.status || '',
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\n');
  downloadFile(`${fileName}.csv`, csvContent, 'text/csv;charset=utf-8;');
}

export function exportAsJson(tasks: Task[], fileName: string) {
  const jsonContent = JSON.stringify(tasks, null, 2);
  downloadFile(`${fileName}.json`, jsonContent, 'application/json;charset=utf-8;');
}

export function exportAsMarkdown(tasks: Task[], fileName: string) {
  const markdownContent = tasks.map(task => {
    let md = `- [ ] ${task.title}`;
    if (task.dueDate) md += ` (Due: ${task.dueDate})`;
    if (task.notes) md += `\n  - ${task.notes.replace(/\n/g, '\n    ')}`;
    return md;
  }).join('\n\n');
  downloadFile(`${fileName}.md`, markdownContent, 'text/markdown;charset=utf-8;');
}
